'use client';
import { motion } from 'framer-motion';
import { Logo } from './logo';

interface AppleLoadingProps {
    isVisible: boolean;
    onComplete?: () => void;
}

export const AppleLoading = ({ isVisible, onComplete }: AppleLoadingProps) => {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
            onAnimationComplete={() => {
                if (onComplete) {
                    setTimeout(onComplete, 100);
                }
            }}
        >
            <div className="flex flex-col items-center gap-8">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="flex items-center gap-4"
                >
                    <motion.div
                        initial={{ rotate: -10, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <Logo className="text-brand size-14" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                        className="text-3xl font-semibold text-foreground"
                    >
                        Arc Lab
                    </motion.h1>
                </motion.div>

                {/* Loading dots */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center gap-2"
                >
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.4,
                                repeat: Infinity,
                                delay: index * 0.2,
                                ease: 'easeInOut',
                            }}
                            className="size-2.5 rounded-full bg-muted-foreground/70"
                        />
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}; 