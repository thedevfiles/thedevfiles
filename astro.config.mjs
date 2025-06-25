import {defineConfig} from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import AstroPWA from '@vite-pwa/astro'

// https://astro.build/config
export default defineConfig({
    output: 'static',
    site: 'https://www.thedevfiles.com',
    trailingSlash: "always",
    outDir: './_site',
    compressHTML: true,
    prefetch: {
        prefetchAll: true,
        defaultStrategy: 'hover'
    },
    experimental: {
        clientPrerender: true,
    },

    build: {
        format: 'directory',
        inlineStylesheets: 'auto',
    },

    redirects: {
        '/page/1/': '/',
        "/tag/[...slug]": "/category/[...slug]",
        '/rss.xml': '/feed.xml',
        '/atom.xml': '/feed.xml',
        '/sitemap.xml': '/sitemap-index.xml',
    },

    markdown: {
        shikiConfig: {
            theme: 'dark-plus',
        },
    },

    adapter: netlify({
        imageCDN: false,
    }),
    integrations: [sitemap({
        filter: (page) => {
            // Exclude specific pages from the sitemap
            return !page.endsWith('/page/1/');
        }
    }), mdx(), AstroPWA({
        manifest: {
            lang: 'en',
            name: 'The Dev Files',
            dir: 'ltr',
            short_name: 'Dev Files',
            description: 'Development blog of Jonathan Bernardi',
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'natural',
            start_url: '/',
            scope: '/',
            icons: [
                {
                    "src": "/images/favicon/196x196.png",
                    "type": "image/png",
                    "sizes": "196x196"
                },
                {
                    "src": "/images/favicon/512x512.png",
                    "type": "image/png",
                    "sizes": "512x512"
                },
                {
                    "src": "/images/favicon/196x196.png",
                    "type": "image/png",
                    "sizes": "196x196",
                    "purpose": "any maskable"
                }
            ]
        },
    })]
});