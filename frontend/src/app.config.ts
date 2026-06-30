import {
    ApplicationConfig,
    APP_INITIALIZER,
} from '@angular/core';
import {
    provideHttpClient,
    withFetch,
    withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
    withInMemoryScrolling,
} from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';

import { appRoutes } from './app.routes';
import { AuthService } from '@/features/auth/services/auth.service';
import { authInterceptor } from '@/core/interceptors/auth.interceptor';
import { LayoutService } from '@/core/layout/service/layout.service';
import { EmeraldPreset } from '@/core/theme/emerald.preset';

export function initializeAppFactory(authService: AuthService) {
    return () => authService.bootstrapSession();
}

export function initializeLayoutFactory(_layoutService: LayoutService) {
    return () => void 0;
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
        provideAnimationsAsync(),

        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            deps: [AuthService],
            multi: true,
        },

        {
            provide: APP_INITIALIZER,
            useFactory: initializeLayoutFactory,
            deps: [LayoutService],
            multi: true,
        },

        providePrimeNG({
            theme: {
                preset: EmeraldPreset,
                options: {
                    darkModeSelector: '.app-dark',
                },
            },
        }),

        MessageService,
    ],
};
