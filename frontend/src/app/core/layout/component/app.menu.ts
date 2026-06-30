import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../features/auth/services/auth.service';
import { MyMenuitem } from './app.menuitem';
import { LayoutService } from '../service/layout.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'my-menu',
    standalone: true,
    imports: [CommonModule, MyMenuitem, RouterModule],
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }

            .menu-wrapper {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow-x: hidden;
                width: 100%;
                color: var(--app-text);
            }

            :host ::ng-deep .layout-menu {
                padding: 0.5rem 0 1rem;
                list-style-type: none;
                margin: 0;
            }

            :host ::ng-deep .layout-menu li {
                width: 100%;
            }

            :host ::ng-deep .layout-root-menuitem > .layout-menuitem-root-text {
                display: inline-flex;
                align-items: center;
                font-size: 0.7rem;
                text-transform: uppercase;
                font-weight: 800;
                color: var(--app-accent-text);
                margin: 1.1rem 0 0.45rem 1rem;
                letter-spacing: 0.12em;
                padding: 0.25rem 0.55rem;
                border-radius: 999px;
                background: var(--app-accent-softer);
                border: 1px solid var(--app-accent-border-softer);
            }

            :host
                ::ng-deep
                .layout-menu
                > li:first-child
                .layout-menuitem-root-text {
                margin-top: 0.6rem;
            }

            :host ::ng-deep .layout-menu li a {
                margin: 0.2rem 0.75rem !important;
                border-radius: 0.85rem !important;
                padding: 0.7rem 0.95rem !important;
                border: 1px solid transparent !important;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.65rem;
                text-decoration: none;
                color: var(--app-text-secondary);
                font-weight: 600;
                font-size: 0.92rem;
                background: transparent;
                transition:
                    background-color 0.2s ease,
                    color 0.2s ease,
                    border-color 0.2s ease,
                    transform 0.2s ease;
            }

            :host ::ng-deep .layout-menu li a i {
                color: var(--app-text-muted);
                transition: color 0.2s ease;
            }

            :host ::ng-deep .layout-menu li a:hover {
                background: var(--app-accent-softer) !important;
                border-color: var(--app-accent-border-softer) !important;
                color: var(--app-text);
                transform: translateX(2px);
            }

            :host ::ng-deep .layout-menu li a:hover i {
                color: var(--app-accent-text);
            }

            :host ::ng-deep .layout-menu li a.router-link-active,
            :host ::ng-deep .layout-menu li a.active-route {
                background: linear-gradient(
                    135deg,
                    var(--app-accent-soft),
                    rgba(20, 184, 166, 0.18)
                ) !important;
                border: 1px solid var(--app-accent-border) !important;
                color: var(--app-text) !important;
                font-weight: 700 !important;
                box-shadow:
                    0 12px 24px rgba(16, 185, 129, 0.18),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.04) !important;
            }

            :host ::ng-deep .layout-menu li a.router-link-active i,
            :host ::ng-deep .layout-menu li a.active-route i {
                color: var(--app-accent-text) !important;
            }

            :host ::ng-deep .layout-menu-item-icon {
                margin-right: 0;
                font-size: 1rem;
                width: 1.1rem;
                display: inline-flex;
                justify-content: center;
            }

            .sidebar-footer {
                display: flex;
                align-items: center;
                gap: 0.7rem;
                margin: 0.85rem 0.85rem 0.4rem;
                padding: 0.85rem 1rem;
                border-radius: 0.95rem;
                background: var(--app-surface-soft);
                border: 1px solid var(--app-border-soft);
            }

            .sidebar-footer-avatar {
                width: 2.25rem;
                height: 2.25rem;
                border-radius: 50%;
                display: grid;
                place-items: center;
                background: linear-gradient(135deg, #10b981, #14b8a6);
                color: #ffffff;
                font-weight: 800;
                font-size: 0.9rem;
                box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
            }

            .sidebar-footer-copy {
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
            }

            .sidebar-footer-title {
                color: var(--app-text);
                font-size: 0.82rem;
                font-weight: 800;
                letter-spacing: 0.04em;
            }

            .sidebar-footer-sub {
                color: var(--app-text-secondary);
                font-size: 0.7rem;
                font-weight: 600;
                letter-spacing: 0.04em;
            }
        `,
    ],
    template: `
        <div class="menu-wrapper">
            <ul class="layout-menu">
                <ng-container *ngFor="let item of model; let i = index">
                    <li class="layout-root-menuitem" *ngIf="!item.separator">
                        <div class="layout-menuitem-root-text">
                            {{ item.label }}
                        </div>

                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <ng-container
                                *ngFor="let child of item.items; let j = index"
                            >
                                <li
                                    my-menuitem
                                    *ngIf="child.visible !== false"
                                    [item]="child"
                                    [index]="j"
                                    [root]="false"
                                ></li>
                            </ng-container>
                        </ul>
                    </li>

                    <li *ngIf="item.separator" class="menu-separator"></li>
                </ng-container>
            </ul>

            <div class="sidebar-footer" aria-hidden="true">
                <span class="sidebar-footer-avatar">C</span>
                <div class="sidebar-footer-copy">
                    <span class="sidebar-footer-title">Compex</span>
                    <span class="sidebar-footer-sub">Panel administrativo</span>
                </div>
            </div>
        </div>
    `,
})
export class MyMenu implements OnInit {
    model: MenuItem[] = [];

    public authService = inject(AuthService);
    private router = inject(Router);
    private layoutService = inject(LayoutService);

    ngOnInit() {
        this.model = this.buildModel();

        this.router.events
            .pipe(filter((e) => e instanceof NavigationEnd))
            .subscribe(() => {
                this.model = this.buildModel();
                this.layoutService.onMenuStateChange({
                    key: 'route',
                    routeEvent: true,
                });
            });
    }

    private buildModel(): MenuItem[] {
        const model: MenuItem[] = [
            {
                label: 'Principal',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/dashboard'],
                    },
                ],
            },
            {
                label: 'Gestion',
                items: [
                    {
                        label: 'Competencias',
                        icon: 'pi pi-fw pi-trophy',
                        routerLink: ['/admin/competencias'],
                    },
                ],
            },
            {
                label: 'Cuenta',
                items: [
                    {
                        label: 'Cerrar Sesion',
                        icon: 'pi pi-fw pi-sign-out',
                        command: () => this.authService.logout(),
                    },
                ],
            },
        ];

        return model.filter(
            (section) =>
                !section.label ||
                section.items?.some((item) => item.visible !== false),
        );
    }
}