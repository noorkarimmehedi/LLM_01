import { createAnthropic } from '@ai-sdk/anthropic';
import { createFireworks } from '@ai-sdk/fireworks';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { LanguageModelV1 } from '@ai-sdk/provider';
import { createTogetherAI } from '@ai-sdk/togetherai';
import { LanguageModelV1Middleware, wrapLanguageModel } from 'ai';
import { ModelEnum, models } from './models';

export const Providers = {
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  TOGETHER: 'together',
  GOOGLE: 'google',
  FIREWORKS: 'fireworks',
} as const;

export type ProviderEnumType = (typeof Providers)[keyof typeof Providers];

// Define a global type for API keys
declare global {
  interface Window {
    AI_API_KEYS?: {
      [key in ProviderEnumType]?: string;
    };
    SERPER_API_KEY?: string;
    JINA_API_KEY?: string;
    NEXT_PUBLIC_APP_URL?: string;
  }
}

// Helper function to get API key from env or global
const getApiKey = (provider: ProviderEnumType): string => {
  // For server environments
  if (typeof process !== 'undefined' && process.env) {
    switch (provider) {
      case Providers.OPENAI:
        if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
        break;
      case Providers.ANTHROPIC:
        if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
        break;
      case Providers.TOGETHER:
        if (process.env.TOGETHER_API_KEY) return process.env.TOGETHER_API_KEY;
        break;
      case Providers.GOOGLE:
        if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
        break;
      case Providers.FIREWORKS:
        if (process.env.FIREWORKS_API_KEY) return process.env.FIREWORKS_API_KEY;
        break;
    }
  }

  // For worker environments (use self)
  if (typeof self !== 'undefined') {
    // Check if AI_API_KEYS exists on self
    if ((self as any).AI_API_KEYS && (self as any).AI_API_KEYS[provider]) {
      return (self as any).AI_API_KEYS[provider];
    }
    
    // For browser environments (self is also defined in browser)
    if (typeof window !== 'undefined' && window.AI_API_KEYS) {
      return window.AI_API_KEYS[provider] || '';
    }
  }

  return '';
};

// Cache for provider instances to avoid recreating them
const providerCache = new Map<ProviderEnumType, any>();

export const getProviderInstance = (provider: ProviderEnumType) => {
  // Check cache first
  if (providerCache.has(provider)) {
    return providerCache.get(provider);
  }

  let instance;
  switch (provider) {
    case Providers.OPENAI:
      instance = createOpenAI({
        apiKey: getApiKey(Providers.OPENAI),
      });
      break;
    case 'anthropic':
      instance = createAnthropic({
        apiKey: getApiKey(Providers.ANTHROPIC),
        headers:{
          "anthropic-dangerous-direct-browser-access": "true"
        }
      });
      break;
    case 'together':
      instance = createTogetherAI({
        apiKey: getApiKey(Providers.TOGETHER),
      });
      break;
    case 'google':
      instance = createGoogleGenerativeAI({
        apiKey: getApiKey(Providers.GOOGLE),
        
      });
      break;
    case 'fireworks':
      instance = createFireworks({
        apiKey: getApiKey(Providers.FIREWORKS),
      });
      break;
    default:
      instance = createOpenAI({
        apiKey: getApiKey(Providers.OPENAI),
      });
  }

  // Cache the instance
  providerCache.set(provider, instance);
  return instance;
};

export const getLanguageModel = (m: ModelEnum, middleware?: LanguageModelV1Middleware) => {
  const model = models.find(model => model.id === m);
  const instance = getProviderInstance(model?.provider as ProviderEnumType);
  const selectedModel = instance(model?.id || 'gpt-4o-mini')
  if(middleware) {
    return wrapLanguageModel({model: selectedModel, middleware }) as LanguageModelV1;
  }
  return selectedModel as LanguageModelV1;
};
