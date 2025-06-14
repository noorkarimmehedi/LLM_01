import { kv } from '@vercel/kv';

const DAILY_CREDITS_AUTH = process.env.FREE_CREDITS_LIMIT_REQUESTS_AUTH
    ? parseInt(process.env.FREE_CREDITS_LIMIT_REQUESTS_AUTH)
    : 0;

const DAILY_CREDITS_IP = process.env.FREE_CREDITS_LIMIT_REQUESTS_IP
    ? parseInt(process.env.FREE_CREDITS_LIMIT_REQUESTS_IP)
    : 0;

// In-memory storage for development
const inMemoryCredits = new Map<string, { credits: number; lastRefill: string }>();

// Helper function to get storage key
function getStorageKey(identifier: string, isUser: boolean): string {
    return isUser ? `credits:user:${identifier}` : `credits:ip:${identifier}`;
}

// Helper function to get in-memory credits
function getInMemoryCredits(key: string, dailyCredits: number): number {
    const now = new Date().toISOString().split('T')[0];
    const stored = inMemoryCredits.get(key);
    
    if (!stored || stored.lastRefill !== now) {
        inMemoryCredits.set(key, { credits: dailyCredits, lastRefill: now });
        return dailyCredits;
    }
    
    return stored.credits;
}

// Helper function to set in-memory credits
function setInMemoryCredits(key: string, credits: number): void {
    const now = new Date().toISOString().split('T')[0];
    inMemoryCredits.set(key, { credits, lastRefill: now });
}

// Lua scripts as named constants
const GET_REMAINING_CREDITS_SCRIPT = `
local key = KEYS[1]
local lastRefillKey = KEYS[2]
local dailyCredits = tonumber(ARGV[1])
local now = ARGV[2]

local lastRefill = redis.call('GET', lastRefillKey)

if lastRefill ~= now then
    redis.call('SET', key, dailyCredits)
    redis.call('SET', lastRefillKey, now)
    return dailyCredits
end

local remaining = redis.call('GET', key)
return remaining or 0
`;

const DEDUCT_CREDITS_SCRIPT = `
local key = KEYS[1]
local cost = tonumber(ARGV[1])

-- Get current credits
local remaining = tonumber(redis.call('GET', key)) or 0

-- Check if enough credits
if remaining < cost then
    return 0
end

-- Deduct credits atomically
redis.call('SET', key, remaining - cost)
return 1
`;

const FORCE_RESET_CREDITS_SCRIPT = `
local key = KEYS[1]
local lastRefillKey = KEYS[2]
local dailyCredits = tonumber(ARGV[1])
local now = ARGV[2]

redis.call('SET', key, dailyCredits)
redis.call('SET', lastRefillKey, now)
return dailyCredits
`;

export type RequestIdentifier = {
    userId?: string;
    ip?: string;
};

export async function getRemainingCredits(identifier: RequestIdentifier): Promise<number> {
    const { userId, ip } = identifier;

    if (userId) {
        return getRemainingCreditsForUser(userId);
    } else if (ip) {
        return getRemainingCreditsForIp(ip);
    }

    return 0;
}

async function getRemainingCreditsForUser(userId: string): Promise<number> {
    if (DAILY_CREDITS_AUTH === 0) {
        return 0;
    }

    try {
        const key = getStorageKey(userId, true);
        const lastRefillKey = `${key}:lastRefill`;
        const now = new Date().toISOString().split('T')[0];

        // Add timeout to Redis operations
        const timeoutPromise = new Promise<number>((resolve) => {
            setTimeout(() => resolve(getInMemoryCredits(key, DAILY_CREDITS_AUTH)), 500);
        });

        const redisPromise = kv.eval(
            GET_REMAINING_CREDITS_SCRIPT,
            [key, lastRefillKey],
            [DAILY_CREDITS_AUTH.toString(), now]
        ).then(result => Number(result));

        return await Promise.race([redisPromise, timeoutPromise]);
    } catch (error) {
        console.error('Failed to get remaining credits for user:', error);
        return getInMemoryCredits(getStorageKey(userId, true), DAILY_CREDITS_AUTH);
    }
}

async function getRemainingCreditsForIp(ip: string): Promise<number> {
    if (DAILY_CREDITS_IP === 0) {
        return 0;
    }

    try {
        const key = getStorageKey(ip, false);
        const lastRefillKey = `${key}:lastRefill`;
        const now = new Date().toISOString().split('T')[0];

        // Add timeout to Redis operations
        const timeoutPromise = new Promise<number>((resolve) => {
            setTimeout(() => resolve(getInMemoryCredits(key, DAILY_CREDITS_IP)), 500);
        });

        const redisPromise = kv.eval(
            GET_REMAINING_CREDITS_SCRIPT,
            [key, lastRefillKey],
            [DAILY_CREDITS_IP.toString(), now]
        ).then(result => Number(result));

        return await Promise.race([redisPromise, timeoutPromise]);
    } catch (error) {
        console.error('Failed to get remaining credits for IP:', error);
        return getInMemoryCredits(getStorageKey(ip, false), DAILY_CREDITS_IP);
    }
}

export async function deductCredits(identifier: RequestIdentifier, cost: number): Promise<boolean> {
    const { userId, ip } = identifier;

    if (userId) {
        return deductCreditsFromUser(userId, cost);
    } else if (ip) {
        return deductCreditsFromIp(ip, cost);
    }

    return false;
}

async function deductCreditsFromUser(userId: string, cost: number): Promise<boolean> {
    try {
        const key = getStorageKey(userId, true);

        return (await kv.eval(DEDUCT_CREDITS_SCRIPT, [key], [cost.toString()])) === 1;
    } catch (error) {
        console.error('Failed to deduct credits from user:', error);
        // Fallback to in-memory storage
        const currentCredits = getInMemoryCredits(getStorageKey(userId, true), DAILY_CREDITS_AUTH);
        if (currentCredits >= cost) {
            setInMemoryCredits(getStorageKey(userId, true), currentCredits - cost);
            return true;
        }
        return false;
    }
}

async function deductCreditsFromIp(ip: string, cost: number): Promise<boolean> {
    try {
        const key = getStorageKey(ip, false);

        return (await kv.eval(DEDUCT_CREDITS_SCRIPT, [key], [cost.toString()])) === 1;
    } catch (error) {
        console.error('Failed to deduct credits from IP:', error);
        // Fallback to in-memory storage
        const currentCredits = getInMemoryCredits(getStorageKey(ip, false), DAILY_CREDITS_IP);
        if (currentCredits >= cost) {
            setInMemoryCredits(getStorageKey(ip, false), currentCredits - cost);
            return true;
        }
        return false;
    }
}

export async function forceResetCredits(identifier: RequestIdentifier): Promise<number> {
    const { userId, ip } = identifier;

    if (userId) {
        return forceResetCreditsForUser(userId);
    } else if (ip) {
        return forceResetCreditsForIp(ip);
    }

    return 0;
}

async function forceResetCreditsForUser(userId: string): Promise<number> {
    try {
        const key = getStorageKey(userId, true);
        const lastRefillKey = `${key}:lastRefill`;
        const now = new Date().toISOString().split('T')[0];

        return await kv.eval(
            FORCE_RESET_CREDITS_SCRIPT,
            [key, lastRefillKey],
            [DAILY_CREDITS_AUTH.toString(), now]
        );
    } catch (error) {
        console.error('Failed to force reset credits for user:', error);
        // Fallback to in-memory storage
        setInMemoryCredits(getStorageKey(userId, true), DAILY_CREDITS_AUTH);
        return DAILY_CREDITS_AUTH;
    }
}

async function forceResetCreditsForIp(ip: string): Promise<number> {
    try {
        const key = getStorageKey(ip, false);
        const lastRefillKey = `${key}:lastRefill`;
        const now = new Date().toISOString().split('T')[0];

        return await kv.eval(
            FORCE_RESET_CREDITS_SCRIPT,
            [key, lastRefillKey],
            [DAILY_CREDITS_IP.toString(), now]
        );
    } catch (error) {
        console.error('Failed to force reset credits for IP:', error);
        // Fallback to in-memory storage
        setInMemoryCredits(getStorageKey(ip, false), DAILY_CREDITS_IP);
        return DAILY_CREDITS_IP;
    }
}

export { DAILY_CREDITS_AUTH, DAILY_CREDITS_IP };
