import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface layoutConfig {
    preset?: string;
    primary?: string;
    surface?: string | undefined | null;
    darkTheme?: boolean;
    menuMode?: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible?: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

type ThemePreference = 'system' | 'light' | 'dark';

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    private readonly THEME_KEY = 'theme_preference';

    private mediaQuery: MediaQueryList | null =
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;

    _config: layoutConfig = {
        preset: 'Aura',
        primary: 'noir',
        surface: null,
        darkTheme: false,
        menuMode: 'static',
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    layoutConfig = signal<layoutConfig>(this._config);
    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();
    private overlayOpen = new Subject<any>();
    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();
    configUpdate$ = this.configUpdate.asObservable();
    overlayOpen$ = this.overlayOpen.asObservable();

    // ✅ CORREGIDO (antes estaba invertido)
    theme = computed(() => (this.layoutConfig().darkTheme ? 'dark' : 'light'));

    isSidebarActive = computed(
        () =>
            this.layoutState().overlayMenuActive ||
            this.layoutState().staticMenuMobileActive,
    );

    isDarkTheme = computed(() => !!this.layoutConfig().darkTheme);
    getPrimary = computed(() => this.layoutConfig().primary);
    getSurface = computed(() => this.layoutConfig().surface);
    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    transitionComplete = signal<boolean>(false);
    private initialized = false;

    constructor() {
        // ✅ aplica tema inicial desde storage (o system) al arrancar
        this.applyInitialThemePreference();

        effect(() => {
            const config = this.layoutConfig();
            if (config) this.onConfigUpdate();
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });
    }

    // -----------------------------
    // ✅ Persistencia de tema
    // -----------------------------
    private applyInitialThemePreference(): void {
        const pref =
            (localStorage.getItem(this.THEME_KEY) as ThemePreference) ||
            'system';

        const dark = this.resolveDarkFromPreference(pref);

        this.layoutConfig.update((s) => ({ ...s, darkTheme: dark }));

        // aplicar inmediatamente (sin esperar transición)
        this.applyThemeClasses(dark);

        // si es system, escuchar cambios del sistema
        this.bindSystemListener(pref);
    }

    private resolveDarkFromPreference(pref: ThemePreference): boolean {
        if (pref === 'dark') return true;
        if (pref === 'light') return false;
        return this.mediaQuery?.matches ?? false; // system
    }

    private systemHandler = () => {
        const pref =
            (localStorage.getItem(this.THEME_KEY) as ThemePreference) ||
            'system';
        if (pref !== 'system') return;

        const dark = this.mediaQuery?.matches ?? false;
        this.layoutConfig.update((s) => ({ ...s, darkTheme: dark }));
        this.applyThemeClasses(dark);
    };

    private bindSystemListener(pref: ThemePreference) {
        if (!this.mediaQuery) return;

        // quitar antes
        try {
            this.mediaQuery.removeEventListener('change', this.systemHandler);
        } catch {
            // @ts-ignore
            this.mediaQuery.removeListener(this.systemHandler);
        }

        if (pref === 'system') {
            try {
                this.mediaQuery.addEventListener('change', this.systemHandler);
            } catch {
                // @ts-ignore
                this.mediaQuery.addListener(this.systemHandler);
            }
        }
    }

    // Llamable desde UI si quieres un selector "system/light/dark"
    setThemePreference(pref: ThemePreference) {
        localStorage.setItem(this.THEME_KEY, pref);
        const dark = this.resolveDarkFromPreference(pref);
        this.layoutConfig.update((s) => ({ ...s, darkTheme: dark }));
        this.bindSystemListener(pref);
    }

    // ✅ Para el botón sol/luna (guarda light/dark fijo)
    toggleTheme() {
        const nextDark = !this.layoutConfig().darkTheme;
        localStorage.setItem(this.THEME_KEY, nextDark ? 'dark' : 'light');
        this.layoutConfig.update((s) => ({ ...s, darkTheme: nextDark }));
        this.bindSystemListener(nextDark ? 'dark' : 'light');
    }

    // -----------------------------
    // Transición dark mode (tu lógica)
    // -----------------------------
    private handleDarkModeTransition(config: layoutConfig): void {
        if ((document as any).startViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready.then(() => this.onTransitionEnd()).catch(() => {});
    }

    // ✅ Aplica app-dark + dark (Tailwind)
    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        this.applyThemeClasses(!!_config.darkTheme);
    }

    private applyThemeClasses(dark: boolean) {
        document.documentElement.classList.toggle('app-dark', dark);
        document.documentElement.classList.toggle('dark', dark); // ✅ para dark: del login
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => this.transitionComplete.set(false));
    }

    // -----------------------------
    // Menu
    // -----------------------------
    onMenuToggle() {
        if (this.isOverlay()) {
            this.layoutState.update((prev) => ({
                ...prev,
                overlayMenuActive: !this.layoutState().overlayMenuActive,
            }));

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuDesktopInactive:
                    !this.layoutState().staticMenuDesktopInactive,
            }));
        } else {
            this.layoutState.update((prev) => ({
                ...prev,
                staticMenuMobileActive:
                    !this.layoutState().staticMenuMobileActive,
            }));

            if (this.layoutState().staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }
}
