// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.taidesoitinpaja.com',
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
