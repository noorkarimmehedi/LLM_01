import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
    transpilePackages: ['next-mdx-remote'],
    images: {
        remotePatterns: [
            { hostname: 'www.google.com' },
            { hostname: 'img.clerk.com' },
            { hostname: 'zyqdiwxgffuy8ymd.public.blob.vercel-storage.com' },
        ],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    experimental: {
        externalDir: true,
        optimizeCss: true,
        optimizePackageImports: ['@phosphor-icons/react', 'lucide-react'],
    },
    webpack: (config, options) => {
        if (!options.isServer) {
            config.resolve.fallback = { fs: false, module: false, path: false };
        }
        
        // Fix ESM module issues
        config.module.rules.push({
            test: /\.m?js$/,
            type: 'javascript/auto',
            resolve: {
                fullySpecified: false,
            },
        });

        // Handle ESM packages
        config.resolve.extensionAlias = {
            '.js': ['.js', '.ts', '.tsx'],
            '.mjs': ['.mjs', '.mts'],
        };

        // Experimental features
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
            layers: true,
        };

        return config;
    },
    async redirects() {
        return [{ source: '/', destination: '/chat', permanent: true }];
    },
    // Add production optimizations
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
    swcMinify: true,
};

export default withSentryConfig(nextConfig, {
    // Sentry configuration
    org: 'saascollect',
    project: 'javascript-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
});
