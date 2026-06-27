import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    template: `
        <div class="bg-[#0a0a0f] overflow-x-hidden text-white font-sans">
            <section class="relative px-6 pb-24 pt-16 md:px-12 md:pb-28 md:pt-24">
                <div
                    class="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(20,184,166,0.1),transparent_30%)] pointer-events-none"
                ></div>

                <div class="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
                    <div>
                        <div
                            class="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300"
                        >
                            <span class="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]"></span>
                            Competencias de programación
                        </div>

                        <h1
                            class="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white md:text-7xl lg:text-8xl"
                        >
                            Compite, resuelve y sube en el ranking.
                        </h1>

                        <p class="mt-8 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl">
                            Compex reúne competencias públicas, inscripción de
                            participantes, problemas para resolver y un ranking
                            global para comparar el desempeño de cada usuario.
                        </p>

                        <div class="mt-10 flex flex-col gap-4 sm:flex-row">
                            @if (isLoggedIn()) {
                                <p-button
                                    label="Ver competencias"
                                    severity="success"
                                    size="large"
                                    routerLink="/competencias"
                                    styleClass="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.28)] hover:scale-105 transition-all duration-300"
                                ></p-button>
                                <p-button
                                    label="Ver ranking"
                                    [outlined]="true"
                                    severity="secondary"
                                    size="large"
                                    icon="pi pi-chart-line"
                                    routerLink="/ranking"
                                    styleClass="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl border-white/10 text-white hover:bg-white/5"
                                ></p-button>
                            } @else {
                                <p-button
                                    label="Crear cuenta"
                                    severity="success"
                                    size="large"
                                    routerLink="/auth/register"
                                    styleClass="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.28)] hover:scale-105 transition-all duration-300"
                                ></p-button>
                                <p-button
                                    label="Explorar competencias"
                                    [outlined]="true"
                                    severity="secondary"
                                    size="large"
                                    icon="pi pi-arrow-up-right"
                                    routerLink="/competencias"
                                    styleClass="w-full sm:w-auto px-8 py-4 text-base font-bold rounded-xl border-white/10 text-white hover:bg-white/5"
                                ></p-button>
                            }
                        </div>
                    </div>

                    <aside class="relative">
                        <div
                            class="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-emerald-400/25 to-teal-400/10 blur-xl"
                        ></div>
                        <div
                            class="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12121a]/95 p-5 shadow-2xl"
                        >
                            <div class="mb-5 flex items-center justify-between">
                                <div>
                                    <span class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Arena</span>
                                    <h2 class="mt-1 text-2xl font-black tracking-tight text-white">
                                        Estado público
                                    </h2>
                                </div>
                                <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                                    <i class="pi pi-trophy text-xl"></i>
                                </div>
                            </div>

                            <div class="space-y-3">
                                @for (item of heroPreview; track item.label) {
                                    <div
                                        class="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"
                                            >
                                                <i [class]="'pi ' + item.icon"></i>
                                            </div>
                                            <div>
                                                <p class="m-0 text-sm font-bold text-white">
                                                    {{ item.label }}
                                                </p>
                                                <p class="m-0 text-xs text-gray-500">
                                                    {{ item.caption }}
                                                </p>
                                            </div>
                                        </div>
                                        <span class="text-sm font-black text-emerald-300">
                                            {{ item.value }}
                                        </span>
                                    </div>
                                }
                            </div>

                            <div class="mt-5 rounded-2xl border border-white/5 bg-[#0d1117] p-4 font-mono text-sm">
                                <div class="mb-3 flex items-center gap-2 text-xs text-gray-500">
                                    <span class="h-2.5 w-2.5 rounded-full bg-red-500/80"></span>
                                    <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></span>
                                    <span class="h-2.5 w-2.5 rounded-full bg-green-500/80"></span>
                                    <span class="ml-2">flujo.txt</span>
                                </div>
                                <p class="m-0 text-gray-400">
                                    <span class="text-emerald-300">1.</span> Revisar competencia abierta
                                </p>
                                <p class="m-0 text-gray-400">
                                    <span class="text-emerald-300">2.</span> Inscribirse con cuenta
                                </p>
                                <p class="m-0 text-gray-400">
                                    <span class="text-emerald-300">3.</span> Resolver problemas
                                </p>
                                <p class="m-0 text-gray-400">
                                    <span class="text-emerald-300">4.</span> Comparar puntos en ranking
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <section id="features" class="border-y border-white/5 bg-[#0f0f15] px-6 py-20 md:px-12">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-12 max-w-2xl">
                        <span class="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Lo que hay en la plataforma</span>
                        <h2 class="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                            Un flujo simple para competir
                        </h2>
                        <p class="mt-4 text-gray-400">
                            El foco del proyecto es administrar competencias,
                            permitir participación individual y mostrar resultados
                            mediante un ranking público.
                        </p>
                    </div>

                    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        @for (card of featureCards; track card.title) {
                            <article
                                class="group rounded-3xl border border-white/5 bg-[#12121a] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-2xl hover:shadow-black/30"
                            >
                                <div
                                    class="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                >
                                    <i [class]="'pi ' + card.icon + ' text-xl'"></i>
                                </div>
                                <h3 class="mb-3 text-xl font-black text-white">
                                    {{ card.title }}
                                </h3>
                                <p class="m-0 text-sm leading-6 text-gray-400">
                                    {{ card.description }}
                                </p>
                            </article>
                        }
                    </div>
                </div>
            </section>

            <section id="how" class="px-6 py-24 md:px-12">
                <div class="mx-auto max-w-7xl">
                    <div class="grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
                        <div>
                            <span class="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Cómo funciona</span>
                            <h2 class="mt-4 text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                                De visitante a participante
                            </h2>
                            <p class="mt-4 text-gray-400">
                                Puedes explorar competencias y ranking sin cuenta.
                                Para inscribirte y ver tu posición personal,
                                necesitas iniciar sesión.
                            </p>
                        </div>

                        <div class="grid gap-4 md:grid-cols-3">
                            @for (step of steps; track step.number) {
                                <article
                                    class="relative overflow-hidden rounded-3xl border border-white/5 bg-[#12121a] p-6"
                                >
                                    <span class="text-5xl font-black tracking-[-0.08em] text-white/10">
                                        0{{ step.number }}
                                    </span>
                                    <h3 class="mt-8 text-xl font-black text-white">
                                        {{ step.title }}
                                    </h3>
                                    <p class="mt-3 text-sm leading-6 text-gray-400">
                                        {{ step.description }}
                                    </p>
                                </article>
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-y border-white/5 bg-[#0f0f15] px-6 py-20 md:px-12">
                <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
                    @for (item of audienceCards; track item.title) {
                        <article class="rounded-3xl border border-white/5 bg-[#12121a] p-7">
                            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-emerald-300">
                                <i [class]="'pi ' + item.icon + ' text-xl'"></i>
                            </div>
                            <h3 class="text-xl font-black text-white">{{ item.title }}</h3>
                            <p class="mt-3 text-sm leading-6 text-gray-400">
                                {{ item.description }}
                            </p>
                        </article>
                    }
                </div>
            </section>

            <section class="px-6 py-24 md:px-12">
                <div class="mx-auto max-w-5xl">
                    <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#12121a] p-8 text-center shadow-2xl md:p-14">
                        <div
                            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_42%)] pointer-events-none"
                        ></div>
                        <div class="relative z-10">
                            <h2 class="text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
                                Empieza por una competencia abierta
                            </h2>
                            <p class="mx-auto mt-5 max-w-2xl text-gray-400">
                                Explora la lista pública, entra al detalle y crea
                                tu cuenta solo cuando quieras inscribirte.
                            </p>
                            <div class="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <p-button
                                    label="Ver competencias"
                                    severity="success"
                                    size="large"
                                    routerLink="/competencias"
                                    styleClass="w-full sm:w-auto px-8 py-3 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                                ></p-button>
                                <p-button
                                    label="Ver ranking"
                                    [outlined]="true"
                                    severity="secondary"
                                    size="large"
                                    routerLink="/ranking"
                                    styleClass="w-full sm:w-auto px-8 py-3 font-bold rounded-xl border-white/10 text-white hover:bg-white/5"
                                ></p-button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="border-t border-white/5 bg-[#0a0a0f] px-6 py-10 md:px-12">
                <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-sm text-gray-500 md:flex-row">
                    <div class="flex items-center gap-3">
                        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                            <i class="pi pi-code text-xs text-gray-400"></i>
                        </div>
                        <span class="font-bold text-gray-300">Compex</span>
                    </div>
                    <div class="flex flex-wrap justify-center gap-5">
                        <a routerLink="/competencias" class="hover:text-emerald-300">Competencias</a>
                        <a routerLink="/ranking" class="hover:text-emerald-300">Ranking</a>
                        <a routerLink="/auth/login" class="hover:text-emerald-300">Login</a>
                    </div>
                    <span>Proyecto Taller 1</span>
                </div>
            </footer>
        </div>
    `,
})
export class LandingPageComponent implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);

    heroPreview = [
        {
            icon: 'pi-list',
            label: 'Competencias',
            caption: 'Listado público y detalle',
            value: 'Público',
        },
        {
            icon: 'pi-user-plus',
            label: 'Inscripción',
            caption: 'Disponible para usuarios',
            value: 'Login',
        },
        {
            icon: 'pi-chart-line',
            label: 'Ranking',
            caption: 'Tabla global de puntos',
            value: 'Global',
        },
    ];

    featureCards = [
        {
            icon: 'pi-trophy',
            title: 'Competencias públicas',
            description:
                'Cualquier visitante puede revisar competencias, fechas, estado, nivel y cupo disponible.',
        },
        {
            icon: 'pi-user-plus',
            title: 'Inscripción individual',
            description:
                'Los usuarios autenticados pueden inscribirse o desinscribirse desde el detalle de cada competencia.',
        },
        {
            icon: 'pi-code',
            title: 'Problemas por competencia',
            description:
                'Al participar, el usuario accede a los problemas asociados para resolverlos dentro de la competencia.',
        },
        {
            icon: 'pi-chart-bar',
            title: 'Ranking global',
            description:
                'El ranking muestra posiciones, puntos, problemas resueltos y competencias participadas.',
        },
    ];

    steps = [
        {
            number: 1,
            title: 'Explora',
            description:
                'Entra a competencias o ranking sin iniciar sesión para revisar qué hay disponible.',
        },
        {
            number: 2,
            title: 'Inscríbete',
            description:
                'Crea una cuenta o inicia sesión para participar en una competencia abierta.',
        },
        {
            number: 3,
            title: 'Compite',
            description:
                'Resuelve problemas, acumula puntos y revisa tu avance en el ranking.',
        },
    ];

    audienceCards = [
        {
            icon: 'pi-user',
            title: 'Para participantes',
            description:
                'Un lugar directo para encontrar competencias abiertas, entrar al detalle y seguir el progreso personal.',
        },
        {
            icon: 'pi-globe',
            title: 'Para visitantes',
            description:
                'Competencias y ranking son públicos, por lo que se puede revisar la actividad antes de crear cuenta.',
        },
        {
            icon: 'pi-shield',
            title: 'Para administradores',
            description:
                'La administración vive en el dashboard separado, donde se gestionan competencias y problemas.',
        },
    ];

    ngOnInit(): void {
        if (this.isLoggedIn() && this.isAdmin()) {
            this.router.navigate(['/dashboard']);
        }
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }
}
