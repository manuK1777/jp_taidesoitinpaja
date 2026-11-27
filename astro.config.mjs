// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO at migration: switch to 'https://www.taidesoitinpaja.com'
  site: 'https://jp-taidesoitinpaja.pages.dev',
  integrations: [sitemap()],
  image: {
    domains: ['cdn.sanity.io'],
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});
