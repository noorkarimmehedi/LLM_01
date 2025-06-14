'use client';
import { useAuth } from '@clerk/nextjs';
import { useAppStore, useChatStore } from '@repo/common/store';
import { useEffect, useState } from 'react';

export const useAppInit = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [startTime] = useState(Date.now());
    const { isLoaded: isAuthLoaded } = useAuth();
    const setIsAppLoading = useAppStore(state => state.setIsAppLoading);
    const isAppLoading = useAppStore(state => state.isAppLoading);
    const threads = useChatStore(state => state.threads);
    const currentThreadId = useChatStore(state => state.currentThreadId);

    useEffect(() => {
        // Check if all initialization is complete
        const isChatStoreReady = threads.length > 0 || currentThreadId !== null;
        const isAuthReady = isAuthLoaded;
        
        // Wait for both auth and chat store to be ready
        if (isAuthReady && (isChatStoreReady || threads.length === 0)) {
            const elapsedTime = Date.now() - startTime;
            const minLoadingTime = 1500; // Minimum 1.5 seconds
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
            
            // Add remaining time for smooth transition
            const timer = setTimeout(() => {
                setIsAppLoading(false);
                setIsInitialized(true);
            }, remainingTime);

            return () => clearTimeout(timer);
        }
    }, [isAuthLoaded, threads.length, currentThreadId, setIsAppLoading, setIsInitialized, startTime]);

    // Reset loading state on page refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            setIsAppLoading(true);
        };

        const handleLoad = () => {
            // Ensure loading state is set on page load
            setIsAppLoading(true);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('load', handleLoad);
        
        // Set loading state immediately on mount
        setIsAppLoading(true);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('load', handleLoad);
        };
    }, [setIsAppLoading]);

    return {
        isInitialized,
        isAppLoading,
    };
}; 