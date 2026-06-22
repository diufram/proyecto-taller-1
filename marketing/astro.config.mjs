import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://me.compex.bitwaise.com',
    output: 'static',
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
        routing: {
            prefixDefaultLocale: true,
        },
    },
});