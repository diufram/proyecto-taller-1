import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [ButtonModule, RouterModule, CommonModule],
    template: `
        <div class="min-h-screen bg-surface-950 overflow-x-hidden">
            <nav
                class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface-950/70 border-b border-surface-800/50"
            >
                <div class="max-w-6xl mx-auto px-8 py-5">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="logo-mask" style="width: 36px; height: 28px"></div>
                            <span class="text-lg font-bold text-surface-0 tracking-tight">
                                Compex
                            </span>
                        </div>

                        <div class="flex items-center gap-8">
                            <a
                                href="#features"
                                class="text-sm text-surface-400 hover:text-surface-0 transition-colors duration-300"
                            >
                                Funciones
                            </a>
                            <a
                                href="#how"
                                class="text-sm text-surface-400 hover:text-surface-0 transition-colors duration-300"
                            >
                                Cómo funciona
                            </a>
                            <p-button
                                label="Entrar"
                                [text]="true"
                                severity="success"
                                size="small"
                                routerLink="/auth/login"
                                styleClass="text-surface-0"
                            >
                            </p-button>
                        </div>
                    </div>
                </div>
            </nav>

            <section class="relative pt-32 pb-20 px-8 overflow-hidden">
                <div class="absolute inset-0">
                    <div class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"></div>
                    <div class="code-rain">
                        @for (line of codeLines; track line.id) {
                            <div
                                class="absolute text-xs font-mono text-primary-500/30 animate-code-rain"
                                [style.left]="line.x + '%'"
                                [style.animation-duration]="line.duration + 's'"
                                [style.animation-delay]="line.delay + 's'"
                            >
                                {{ line.text }}
                            </div>
                        }
                    </div>
                </div>

                <div class="max-w-4xl mx-auto text-center relative z-10">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in"
                    >
                        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Competiciones en vivo</span>
                    </div>

                    <h1
                        class="text-5xl md:text-6xl lg:text-8xl font-bold text-surface-0 mb-8 tracking-tight leading-[1.1] animate-slide-up"
                    >
                        Domina el arte de
                        <br />
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 animate-text-shimmer">
                            programar
                        </span>
                    </h1>

                    <p
                        class="text-xl text-surface-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay"
                    >
                        Plataforma profesional para competencias de programación.
                        Evalúa, compara y perfecciona tus habilidades con desafíos
                        reales.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                        <p-button
                            label="Comenzar gratis"
                            severity="success"
                            size="large"
                            routerLink="/auth/register"
                            styleClass="px-8"
                        >
                        </p-button>

                        <p-button
                            label="Ver demo"
                            [text]="true"
                            size="large"
                            icon="pi pi-play"
                            iconPos="left"
                            routerLink="/auth/login"
                            styleClass="text-surface-300"
                        >
                        </p-button>
                    </div>
                </div>

                <div class="max-w-5xl mx-auto mt-20 relative animate-fade-in-up-delay">
                    <div class="code-window">
                        <div class="code-window-header">
                            <div class="flex gap-2">
                                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <span class="text-xs text-surface-500">solucion.ts</span>
                        </div>
                        <pre class="code-content text-sm font-mono"><code><span class="text-primary-400">function</span> <span class="text-blue-400">resolverProblema</span>(<span class="text-orange-400">problema</span>) {{ '{)' }}
  <span class="text-primary-400">const</span> <span class="text-green-400">solucion</span> = <span class="text-primary-400">evaluar</span>(problema);
  <span class="text-primary-400">return</span> optimizacion(solucion);
{{ '})' }}

<span class="text-surface-500">// Ejecutando evaluación...</span>
<span class="text-yellow-400">✓</span> <span class="text-surface-300">Caso 1:</span> <span class="text-green-400">PASS</span>
<span class="text-yellow-400">✓</span> <span class="text-surface-300">Caso 2:</span> <span class="text-green-400">PASS</span>
<span class="text-yellow-400">✓</span> <span class="text-surface-300">Caso 3:</span> <span class="text-green-400">PASS</span>
<span class="text-green-400">🎉 Tiempo: 45ms</span></code></pre>
                    </div>
                </div>
            </section>

            <section class="py-32 px-8 bg-surface-900/50">
                <div class="max-w-6xl mx-auto">
                    <div class="grid md:grid-cols-3 gap-6">
                        @for (card of featureCards; track card.title) {
                            <div
                                class="group relative p-8 rounded-2xl bg-surface-900 border border-surface-800 hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-2"
                            >
                                <div
                                    class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                ></div>
                                <div class="relative z-10">
                                    <div
                                        class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                                    >
                                        <i [class]="'pi ' + card.icon + ' text-2xl text-primary-400'"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-surface-0 mb-3">
                                        {{ card.title }}
                                    </h3>
                                    <p class="text-surface-400 text-sm leading-relaxed">
                                        {{ card.description }}
                                    </p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <section id="features" class="py-32 px-8">
                <div class="max-w-6xl mx-auto">
                    <div class="text-center mb-20">
                        <h2 class="text-4xl md:text-5xl font-bold text-surface-0 mb-4 tracking-tight">
                            Todo lo que necesitas
                        </h2>
                        <p class="text-lg text-surface-400 max-w-xl mx-auto">
                            Herramientas diseñadas para llevar tu programación al siguiente nivel.
                        </p>
                    </div>

                    <div class="space-y-32">
                        @for (feature of features; track feature.title; let i = $index) {
                            <div class="grid lg:grid-cols-2 gap-16 items-center" [class.order-2]="i % 2 === 1">
                                <div [class.order-2]="i % 2 === 1">
                                    <span class="inline-block px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium mb-4">
                                        {{ feature.tag }}
                                    </span>
                                    <h3 class="text-3xl md:text-4xl font-bold text-surface-0 mb-6 tracking-tight">
                                        {{ feature.title }}
                                    </h3>
                                    <p class="text-surface-400 mb-8 leading-relaxed">
                                        {{ feature.description }}
                                    </p>
                                    <ul class="space-y-4">
                                        @for (item of feature.items; track item) {
                                            <li class="flex items-center gap-3 text-surface-300">
                                                <div class="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center">
                                                    <i class="pi pi-check text-xs text-primary-400"></i>
                                                </div>
                                                <span>{{ item }}</span>
                                            </li>
                                        }
                                    </ul>
                                </div>
                                <div [class.order-1]="i % 2 === 1">
                                    <div class="relative">
                                        <div class="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-50"></div>
                                        <div class="relative bg-surface-900 rounded-2xl p-8 border border-surface-700">
                                            <div class="code-window">
                                                <div class="code-window-header">
                                                    <div class="flex gap-2">
                                                        <div class="w-2 h-2 rounded-full bg-surface-600"></div>
                                                        <div class="w-2 h-2 rounded-full bg-surface-600"></div>
                                                        <div class="w-2 h-2 rounded-full bg-surface-600"></div>
                                                    </div>
                                                </div>
                                                <pre class="text-sm font-mono text-surface-300"><code [innerHTML]="feature.code"></code></pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <section id="how" class="py-32 px-8 bg-surface-900/50">
                <div class="max-w-4xl mx-auto">
                    <div class="text-center mb-16">
                        <h2 class="text-4xl font-bold text-surface-0 mb-4 tracking-tight">
                            ¿Cómo funciona?
                        </h2>
                        <p class="text-lg text-surface-400">
                            Tres pasos para dominar la competencia
                        </p>
                    </div>

                    <div class="grid md:grid-cols-3 gap-8">
                        @for (step of steps; track step.number; let i = $index) {
                            <div class="relative">
                                <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 to-transparent hidden md:block"></div>
                                <div class="relative text-center">
                                    <div
                                        class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-surface-0 shadow-lg shadow-primary-500/30"
                                    >
                                        {{ step.number }}
                                    </div>
                                    <h4 class="text-xl font-semibold text-surface-0 mb-3">
                                        {{ step.title }}
                                    </h4>
                                    <p class="text-surface-400 text-sm">
                                        {{ step.description }}
                                    </p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <section class="py-32 px-8">
                <div class="max-w-4xl mx-auto">
                    <div class="relative">
                        <div class="absolute -inset-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 rounded-3xl blur-xl opacity-30"></div>
                        <div class="relative bg-gradient-to-br from-surface-800 to-surface-900 rounded-3xl p-12 md:p-20 border border-surface-700">
                            <div class="text-center">
                                <h2 class="text-4xl md:text-5xl font-bold text-surface-0 mb-6 tracking-tight">
                                    Listo para competir?
                                </h2>
                                <p class="text-xl text-surface-400 mb-10 max-w-lg mx-auto">
                                    Únete a miles de programadores que ya están
                                    mejorando sus habilidades con nosotros.
                                </p>
                                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                    <p-button
                                        label="Crear cuenta gratis"
                                        severity="success"
                                        size="large"
                                        routerLink="/auth/register"
                                        styleClass="px-10"
                                    >
                                    </p-button>
                                    <p-button
                                        label="Iniciar sesión"
                                        [outlined]="true"
                                        size="large"
                                        routerLink="/auth/login"
                                        styleClass="px-10"
                                    >
                                    </p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="py-12 px-8 border-t border-surface-800">
                <div class="max-w-6xl mx-auto">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div class="flex items-center gap-3">
                            <div class="logo-mask" style="width: 28px; height: 22px; filter: brightness(0) invert(1);"></div>
                            <span class="text-sm font-semibold text-surface-400">
                                Compex
                            </span>
                        </div>

                        <div class="flex items-center gap-6 text-surface-500 text-sm">
                            <a href="#" class="hover:text-surface-300 transition-colors">Términos</a>
                            <a href="#" class="hover:text-surface-300 transition-colors">Privacidad</a>
                            <span>© 2024 Compex</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <style>
            @keyframes code-rain {
                0% {
                    transform: translateY(-100vh);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(100vh);
                    opacity: 0;
                }
            }

            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }

            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slide-up {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fade-in-up {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-code-rain {
                animation: code-rain linear infinite;
            }

            .animate-text-shimmer {
                background-size: 200% auto;
                animation: shimmer 3s linear infinite;
            }

            .animate-fade-in {
                animation: fade-in 1s ease-out forwards;
            }

            .animate-slide-up {
                animation: slide-up 1s ease-out forwards;
            }

            .animate-slide-up-delay {
                animation: slide-up 1s ease-out 0.2s forwards;
                opacity: 0;
            }

            .animate-fade-in-up {
                animation: fade-in-up 1s ease-out 0.4s forwards;
                opacity: 0;
            }

            .animate-fade-in-up-delay {
                animation: fade-in-up 1s ease-out 0.6s forwards;
                opacity: 0;
            }

            .code-window {
                background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .code-window-header {
                padding: 12px 16px;
                background: rgba(255, 255, 255, 0.03);
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .code-content {
                padding: 20px;
                line-height: 1.8;
                margin: 0;
            }
        </style>
    `,
})
export class LandingPageComponent implements OnInit {
    private router = inject(Router);

    codeLines: { id: number; x: string; text: string; duration: number; delay: number }[] = [];
    featureCards = [
        {
            icon: 'pi-trophy',
            title: 'Competiciones en vivo',
            description: 'Participa en desafíos de programación con evaluación automatizada y ranking en tiempo real.'
        },
        {
            icon: 'pi-chart-line',
            title: 'Análisis profundo',
            description: 'Estadísticas detalladas de tu desempeño, identificación de áreas de mejora.'
        },
        {
            icon: 'pi-users',
            title: 'Comunidad activa',
            description: 'Conecta con otros programadores, forma equipos y colabora en competencias.'
        }
    ];
    features = [
        {
            tag: 'Problemas',
            title: 'Biblioteca de desafíos',
            description: 'Miles de problemas organizados por dificultad y categoría. Practica con casos reales y prepara.',
            items: ['Múltiples lenguajes', 'Casos de prueba', 'Evaluación instantánea'],
            code: `<span class="text-primary-400">const</span> <span class="text-blue-400">problema</span> = {
  <span class="text-orange-400">id</span>: <span class="text-green-400">42</span>,
  <span class="text-orange-400">titulo</span>: <span class="text-green-400">"Ordenamiento"</span>,
  <span class="text-orange-400">dificultad</span>: <span class="text-yellow-400">"medio"</span>,
  <span class="text-orange-400">categoria</span>: <span class="text-green-400">"Algoritmos"</span>
};

<span class="text-primary-400">await</span> resolver(problema);
<span class="text-green-400">✓</span> <span class="text-surface-400">Resuelto!</span>`
        },
        {
            tag: 'Ranking',
            title: 'Tabla de posiciones',
            description: 'Compite con otros desarrolladores y escala posiciones. Sigue tu progreso histórico.',
            items: ['Posiciones en vivo', 'Historial completo', 'Métricas de progreso'],
            code: `<span class="text-surface-400">// Tu posición actual</span>
<span class="text-primary-400">const</span> <span class="text-blue-400">rank</span> = {
  <span class="text-orange-400">posicion</span>: <span class="text-green-400">#47</span>,
  <span class="text-orange-400">puntos</span>: <span class="text-green-400">2840</span>,
  <span class="text-orange-400">competiciones</span>: <span class="text-green-400">12</span>
};

<span class="text-primary-400">if</span> (rank.mejoro) {
  <span class="text-yellow-400">🎉</span> <span class="text-surface-300">Nuevo record!</span>
}`
        },
        {
            tag: 'Feedback',
            title: 'Retroalimentación precisa',
            description: 'Recibe análisis detallados de cada solución. Mejora continuamente con feedback constructivo.',
            items: ['Análisis de código', 'Sugerencias', 'Optimización'],
            code: `<span class="text-primary-400">const</span> <span class="text-blue-400">feedback</span> = {
  <span class="text-orange-400">puntuacion</span>: <span class="text-green-400">95/100</span>,
  <span class="text-orange-400">comentarios</span>: [
    <span class="text-green-400">"Código limpio"</span>,
    <span class="text-green-400">"Buena complejidad"</span>
  ],
  <span class="text-orange-400">sugerencia</span>: <span class="text-yellow-400">"Optimiza el sort"</span>
};

<span class="text-primary-400">this</span>.aplicarMejoras(feedback);`
        }
    ];
    steps = [
        {
            number: 1,
            title: 'Regístrate',
            description: 'Crea tu cuenta en segundos y accede a todas las funcionalidades.'
        },
        {
            number: 2,
            title: 'Únete a competencias',
            description: 'Explora desafíos disponibles y participa en los que prefieras.'
        },
        {
            number: 3,
            title: 'Demuestra tu skill',
            description: 'Resuelve problemas, sube soluciones y escala el ranking.'
        }
    ];

    ngOnInit(): void {
        const texts = [
            'const x = 42;',
            'if (a > b)',
            'return true;',
            'for (i = 0)',
            'array.map()',
            'obj.name',
            'func() {}',
          '=> {}',
            '...spread',
            '{ key: val }',
        ];

        this.codeLines = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: String(Math.random() * 100),
            text: texts[Math.floor(Math.random() * texts.length)],
            duration: 8 + Math.random() * 12,
            delay: Math.random() * 10,
        }));
    }
}