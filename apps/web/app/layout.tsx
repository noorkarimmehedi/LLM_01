import { ClerkProvider } from '@clerk/nextjs';
import { RootLayout } from '@repo/common/components';
import { ReactQueryProvider, RootProvider } from '@repo/common/context';
import { TooltipProvider, cn } from '@repo/ui';
import { GeistMono } from 'geist/font/mono';
import type { Viewport } from 'next';
import { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import localFont from 'next/font/local';

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    variable: '--font-bricolage',
});

import './globals.css';

export const metadata: Metadata = {
    title: 'Arc Lab - Go Deeper with AI-Powered Research & Agentic Workflows',
    description:
        'Arc Lab is a sophisticated AI-powered chatbot platform that prioritizes privacy while offering powerful research and agentic capabilities.',
    keywords: ['AI', 'Chat', 'Research', 'Privacy', 'Workflow', 'Agentic'],
    authors: [{ name: 'Arc Lab' }],
    creator: 'Arc Lab',
    publisher: 'Arc Lab',
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://arclab.ai',
        title: 'Arc Lab - Go Deeper with AI-Powered Research & Agentic Workflows',
        description:
            'Arc Lab is a sophisticated AI-powered chatbot platform that prioritizes privacy while offering powerful research and agentic capabilities.',
        siteName: 'Arc Lab',
        images: [
            {
                url: 'https://arclab.ai/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'CCLeo Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Arc Lab - Go Deeper with AI-Powered Research & Agentic Workflows',
        description:
            'Arc Lab is a sophisticated AI-powered chatbot platform that prioritizes privacy while offering powerful research and agentic capabilities.',
        site: 'Arc Lab',
        creator: '@ccleo_ai',
        images: ['https://arclab.ai/twitter-image.jpg'],
    },
    icons: {
        icon: '/favicon.svg?v=' + Date.now(),
        shortcut: '/favicon.svg?v=' + Date.now(),
        apple: '/favicon.svg?v=' + Date.now(),
    },
    manifest: '/manifest.webmanifest',
    other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'Arc Lab',
        'mobile-web-app-capable': 'yes',
        'msapplication-TileColor': '#000000',
        'msapplication-tap-highlight': 'no',
    },
    verification: {
        google: 'your-google-verification-code',
    },
    alternates: {
        canonical: 'https://arclab.ai',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

const inter = localFont({
    src: './InterVariable.woff2',
    variable: '--font-inter',
});

const clash = localFont({
    src: './ClashGrotesk-Variable.woff2',
    variable: '--font-clash',
});

export default function ParentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(GeistMono.variable, inter.variable, clash.variable, bricolage.variable)}
            suppressHydrationWarning
        >
            <head>
                <link rel="icon" type="image/svg+xml" href={`/favicon.svg?v=${Date.now()}`} />
                <link rel="shortcut icon" href={`/favicon.svg?v=${Date.now()}`} />
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />

                {/* <script
                    crossOrigin="anonymous"
                    src="//unpkg.com/react-scan/dist/auto.global.js"
                ></script> */}
            </head>
            <body>
                {/* <PostHogProvider> */}
                <ClerkProvider>
                    <RootProvider>
                        {/* <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          > */}
                        <TooltipProvider>
                            <ReactQueryProvider>
                                <RootLayout>{children}</RootLayout>
                            </ReactQueryProvider>
                        </TooltipProvider>
                        {/* </ThemeProvider> */}
                    </RootProvider>
                </ClerkProvider>
                {/* </PostHogProvider> */}
            </body>
        </html>
    );
}
