import {
    Component,
    OnInit,
    inject,
    ViewChild,
    ElementRef,
    AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, BreadcrumbModule, RouterModule],
    template: `
        <div
            #container
            class="breadcrumb-container mb-2"
            *ngIf="items.length > 0"
        >
            <p-breadcrumb
                [model]="items"
                [home]="homeItem"
                styleClass="compact-breadcrumb"
            >
            </p-breadcrumb>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                color: var(--app-text);
            }

            :host ::ng-deep .breadcrumb-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.65rem 0.9rem;
                background: var(--app-surface);
                border: 1px solid var(--app-border);
                border-radius: 0.95rem;
                box-shadow: var(--app-shadow-sm);
                overflow-x: auto;
                white-space: nowrap;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                transition:
                    background-color 0.3s ease,
                    border-color 0.3s ease;

                &::-webkit-scrollbar {
                    display: none;
                }
                scrollbar-width: none;
            }

            :host ::ng-deep .compact-breadcrumb {
                background: transparent !important;
                border: none !important;
                padding: 0 !important;

                .p-breadcrumb-list {
                    display: flex;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    gap: 0.15rem;
                }

                li.p-breadcrumb-chevron {
                    font-size: 0.7rem;
                    margin: 0 0.4rem;
                    color: var(--app-text-secondary);
                }

                .p-menuitem-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.25rem 0.55rem;
                    border-radius: 0.55rem;
                    text-decoration: none;
                    transition:
                        background-color 0.2s ease,
                        color 0.2s ease;

                    .p-menuitem-text {
                        font-size: 0.85rem;
                        color: var(--app-text-secondary);
                        white-space: nowrap;
                        font-weight: 600;
                    }
                    .p-menuitem-icon {
                        color: var(--app-accent-text);
                        font-size: 0.95rem;
                    }

                    &:hover {
                        background: var(--app-accent-softer);

                        .p-menuitem-text {
                            color: var(--app-accent-text);
                        }
                    }
                }

                li.active-item .p-menuitem-link {
                    cursor: default;
                    pointer-events: none;
                    background: var(--app-accent-softer);
                    border: 1px solid var(--app-accent-border-softer);

                    .p-menuitem-text {
                        color: var(--app-accent-text-strong) !important;
                        font-weight: 800 !important;
                        font-size: 0.9rem !important;
                    }

                    .p-menuitem-icon {
                        color: var(--app-accent-text) !important;
                    }
                }
            }
        `,
    ],
})
export class AppBreadcrumbComponent implements OnInit, AfterViewChecked {
    @ViewChild('container') containerRef!: ElementRef;

    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    items: MenuItem[] = [];
    homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/dashboard' };
    private scrollNeeded = false;

    ngOnInit() {
        this.generateBreadcrumbs();
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.generateBreadcrumbs();
                this.scrollNeeded = true;
            });
    }

    ngAfterViewChecked() {
        if (this.scrollNeeded && this.containerRef) {
            setTimeout(() => {
                const el = this.containerRef.nativeElement;
                el.scrollLeft = el.scrollWidth;
                this.scrollNeeded = false;
            }, 50);
        }
    }

    private generateBreadcrumbs() {
        const crumbs = this.createBreadcrumbs(this.activatedRoute.root);

        if (crumbs.length > 0) {
            crumbs.forEach((c) => (c.styleClass = ''));

            const lastItem = crumbs[crumbs.length - 1];
            lastItem.styleClass = 'active-item';
        }

        this.items = crumbs;
    }

    private createBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: MenuItem[] = [],
    ): MenuItem[] {
        const children: ActivatedRoute[] = route.children;
        if (children.length === 0) return breadcrumbs;

        for (const child of children) {
            const routeURL: string = child.snapshot.url
                .map((segment) => segment.path)
                .join('/');

            const label = child.snapshot.data['breadcrumb'];

            if (routeURL !== '') {
                url += `/${routeURL}`;
            }

            const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];

            if (label && (!lastBreadcrumb || lastBreadcrumb.label !== label)) {
                breadcrumbs.push({ label, routerLink: url || '/' });
            }

            const result = this.createBreadcrumbs(child, url, breadcrumbs);

            for (const cb of result) {
                if (!breadcrumbs.some((b) => b.label === cb.label)) {
                    breadcrumbs.push(cb);
                }
            }
        }
        return breadcrumbs;
    }
}