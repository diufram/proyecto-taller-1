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
                aria-label="Alternar menú"
            >
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/dashboard">
                <span class="logo-mask" role="img" aria-label="Logo"></span>
                <span class="logo-text">Compex</span>
            </a>
        </div>

        <div class="layout-topbar-spacer"></div>

        <div class="layout-topbar-actions">
            <span class="layout-topbar-eyebrow">Administración</span>
            <div class="layout-topbar-divider"></div>
            <button
                type="button"
                class="layout-topbar-action"
                (click)="toggleDarkMode()"
                [attr.aria-label]="
                    layoutService.isDarkTheme() ? 'Modo claro' : 'Modo oscuro'
                "
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
    </div>`,
    styles: [
        `
            :host {
                display: block;
            }

            :host ::ng-deep .layout-topbar {
                position: fixed;
                inset: 0 0 auto 0;
                height: 4.25rem;
                z-index: 997;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                background: rgba(10, 10, 15, 0.72);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32);
                color: #ffffff;
            }

            :host ::ng-deep .layout-topbar-logo-container {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                min-width: 0;
            }

            :host ::ng-deep .layout-menu-button {
                width: 2.5rem;
                height: 2.5rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 0.75rem;
                color: #cbd5f5;
                cursor: pointer;
                transition:
                    background-color 0.2s ease,
                    color 0.2s ease,
                    border-color 0.2s ease;
            }

            :host ::ng-deep .layout-menu-button:hover {
                background: rgba(16, 185, 129, 0.12);
                border-color: rgba(16, 185, 129, 0.35);
                color: #6ee7b7;
            }

            :host ::ng-deep .layout-topbar-logo {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                color: #ffffff;
                text-decoration: none;
                font-weight: 800;
                font-size: 1.1rem;
                letter-spacing: -0.01em;
            }

            :host ::ng-deep .layout-topbar-logo .logo-mask {
                width: 2.1rem;
                height: 2.1rem;
                border-radius: 0.55rem;
                background-color: rgba(16, 185, 129, 0.15);
                border: 1px solid rgba(16, 185, 129, 0.32);
                background-image: url('/icono_p.png');
                background-repeat: no-repeat;
                background-position: center;
                background-size: 65%;
                flex: 0 0 auto;
            }

            :host ::ng-deep .layout-topbar-logo .logo-text {
                color: #ffffff;
            }

            :host ::ng-deep .layout-topbar-spacer {
                flex: 1 1 auto;
            }

            :host ::ng-deep .layout-topbar-actions {
                margin-left: 0;
                display: flex;
                align-items: center;
                gap: 0.85rem;
            }

            :host ::ng-deep .layout-topbar-eyebrow {
                display: inline-flex;
                align-items: center;
                padding: 0.3rem 0.65rem;
                border-radius: 999px;
                border: 1px solid rgba(16, 185, 129, 0.25);
                background: rgba(16, 185, 129, 0.08);
                color: #6ee7b7;
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
            }

            :host ::ng-deep .layout-topbar-divider {
                width: 1px;
                height: 1.6rem;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 999px;
            }

            :host ::ng-deep .layout-topbar-action {
                width: 2.5rem;
                height: 2.5rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 0.75rem;
                color: #cbd5f5;
                cursor: pointer;
                transition:
                    background-color 0.2s ease,
                    color 0.2s ease,
                    border-color 0.2s ease;
            }

            :host ::ng-deep .layout-topbar-action:hover {
                background: rgba(16, 185, 129, 0.12);
                border-color: rgba(16, 185, 129, 0.35);
                color: #6ee7b7;
            }

            :host ::ng-deep .layout-topbar-action i {
                font-size: 1.05rem;
            }

            :host ::ng-deep .layout-config-menu {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            :host ::ng-deep .layout-topbar-nav-link {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                color: var(--text-color-secondary);
                font-size: 0.875rem;
                font-weight: 500;
                text-decoration: none;
                transition: color 0.2s ease;
            }

            :host ::ng-deep .layout-topbar-nav-link:hover {
                color: var(--text-color);
            }

            :host ::ng-deep .layout-topbar-nav-active {
                color: var(--primary-color);
            }

            @media (max-width: 720px) {
                :host ::ng-deep .layout-topbar-eyebrow,
                :host ::ng-deep .layout-topbar-divider {
                    display: none;
                }

                :host ::ng-deep .layout-topbar {
                    padding: 0 1rem;
                }
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