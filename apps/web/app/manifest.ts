import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Arc Lab',
        short_name: 'Arc Lab',
        description:
            'Arc Lab is a modern AI chat client that allows you to chat with AI in a more intuitive way.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/favicon.svg?v=' + Date.now(),
                sizes: 'any',
                type: 'image/svg+xml',
            }
        ],
    };
}
