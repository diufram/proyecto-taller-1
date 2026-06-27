import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { MyConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'my-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, MyConfigurator],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button
                class="layout-menu-button layout-topbar-action"
                (click)="layoutService.onMenuToggle()"
            >
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/dashboard">
                <div class="logo-mask" role="img" aria-label="Logo"></div>
                <span>Compex</span>
            </a>
        </div>

        <nav class="layout-topbar-nav hidden md:flex items-center gap-6 mr-3">
            <a
                routerLink="/admin/competencias"
                routerLinkActive="layout-topbar-nav-active"
                class="layout-topbar-nav-link"
            >
                <i class="pi pi-trophy text-sm"></i>
                <span>Competencias</span>
            </a>
        </nav>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button
                    type="button"
                    class="layout-topbar-action"
                    (click)="toggleDarkMode()"
                >
                    <i
                        [ngClass]="{
                            'pi ': true,
                            'pi-moon': layoutService.isDarkTheme(),
                            'pi-sun': !layoutService.isDarkTheme(),
                        }"
                    ></i>
                </button>
                <div class="relative">
                    <!-- <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button> -->
                    <my-configurator />
                </div>
            </div>
        </div>
    </div>`,
    styles: [
        `
            .layout-topbar-nav-link {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                color: var(--text-color-secondary);
                font-size: 0.875rem;
                font-weight: 500;
                text-decoration: none;
                transition: color 0.2s ease;
            }
            .layout-topbar-nav-link:hover {
                color: var(--text-color);
            }
            .layout-topbar-nav-active {
                color: var(--primary-color);
            }
        `,
    ],
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.toggleTheme();
    }
}
