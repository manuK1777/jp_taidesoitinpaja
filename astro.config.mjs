// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO at migration: switch to 'https://www.taidesoitinpaja.com'
  site: 'https://jp-taidesoitinpaja.pages.dev',
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
