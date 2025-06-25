import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import serviceWorker from "astrojs-service-worker";

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

  build:{
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

  adapter: netlify({
    imageCDN: false,
  }),
  integrations: [sitemap({
    filter: (page) => {
      // Exclude specific pages from the sitemap
      return !page.endsWith('/page/1/');
    }
  }), mdx(), serviceWorker()]
});