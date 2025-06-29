'use client';
import { TableOfMessages, Thread } from '@repo/common/components';
import { useChatStore } from '@repo/common/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStickToBottom } from 'use-stick-to-bottom';

const ChatSessionPage = ({ params }: { params: { threadId: string } }) => {
    const router = useRouter();
    const isGenerating = useChatStore(state => state.isGenerating);
    const [shouldScroll, setShouldScroll] = useState(isGenerating);
    const { scrollRef, contentRef } = useStickToBottom({
        stiffness: 1,
        damping: 0,
    });
    const switchThread = useChatStore(state => state.switchThread);
    const getThread = useChatStore(state => state.getThread);

    useEffect(() => {
        if (isGenerating) {
            setShouldScroll(true);
        } else {
            const timer = setTimeout(() => {
                setShouldScroll(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isGenerating]);

    useEffect(() => {
        const { threadId } = params;
        if (!threadId) {
            return;
        }
        
        // Switch thread optimistically for immediate UI response
        switchThread(threadId);
        
        // Load thread data asynchronously without blocking
        Promise.resolve().then(async () => {
            try {
                const thread = await getThread(threadId);
                if (!thread?.id) {
                    router.push('/chat');
                }
            } catch (error) {
                console.warn('Error loading thread:', error);
                // Don't redirect on error, let the user stay on the page
            }
        });
    }, [params]);

    return (
        <div
            className="no-scrollbar flex w-full flex-1 flex-col items-center overflow-y-auto px-8"
            ref={shouldScroll ? scrollRef : undefined}
        >
            <div className="mx-auto w-full max-w-3xl px-4 pb-[200px] pt-2" ref={contentRef}>
                <Thread />
            </div>

            <TableOfMessages />
        </div>
    );
};

export default ChatSessionPage;
