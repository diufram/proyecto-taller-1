import { ui, defaultLocale, type Locale, type TranslationKey } from './ui';

export { languages, defaultLocale } from './ui';
export type { Locale, TranslationKey } from './ui';

export function getLocaleFromUrl(url: URL): Locale {
    const [, candidate] = url.pathname.split('/');
    if (candidate === 'es' || candidate === 'en') {
        return candidate;
    }
    return defaultLocale;
}

export function t(locale: Locale, key: TranslationKey): string {
    const dict = ui[locale] ?? ui[defaultLocale];
    const value = (dict as Record<string, string>)[key];
    return value ?? (ui[defaultLocale] as Record<string, string>)[key] ?? key;
}

export function buildLocalizedPath(
    locale: Locale,
    path: string,
): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}