import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [ButtonModule, RouterModule, CommonModule],
    template: `
        <div
            class="min-h-screen bg-[#0a0a0f] overflow-x-hidden text-white font-sans"
        >
            <!-- Navbar -->
            <nav
                class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5"
            >
                <div class="max-w-7xl mx-auto px-6 md:px-12 py-4">
                    <div class="flex items-center justify-between">
                        <div
                            class="flex items-center gap-3 cursor-pointer"
                            routerLink="/"
                        >
                            <div
                                class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20"
                            >
                                <i
                                    class="pi pi-code text-[#0a0a0f] text-sm font-bold"
                                ></i>
                            </div>
                            <span
                                class="text-xl font-bold tracking-tight text-white"
                            >
                                Compex
                            </span>
                        </div>

                        <div class="hidden md:flex items-center gap-8">
                            <a
                                href="#features"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Funciones</a
                            >
                            <a
                                href="#how"
                                class="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
                                >Cómo funciona</a
                            >
                        </div>

                        <div class="flex items-center gap-4">
                            <a
                                href="#"
                                class="hidden md:block text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >Login</a
                            >
                            <p-button
                                label="Comenzar"
                                severity="success"
                                size="small"
                                routerLink="/auth/register"
                                styleClass="font-semibold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
                            ></p-button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section
                class="relative pt-40 pb-24 px-6 md:px-12 flex flex-col items-center justify-center min-h-[90vh]"
            >
                <!-- Background gradient -->
                <div
                    class="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-[#0a0a0f] pointer-events-none"
                ></div>
                <div
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"
                ></div>

                <div class="max-w-4xl mx-auto text-center relative z-10 w-full">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-8"
                    >
                        <span class="relative flex h-2 w-2">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                            ></span>
                            <span
                                class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                            ></span>
                        </span>
                        <span>Competiciones en vivo 24/7</span>
                    </div>

                    <h1
                        class="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Domina el arte de
                        <br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                        >
                            programar
                        </span>
                    </h1>

                    <p
                        class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Plataforma profesional para competencias de código.
                        Evalúa, compara y perfecciona tus habilidades con
                        desafíos del mundo real y feedback instantáneo.
                    </p>

                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <p-button
                            label="Comenzar gratis"
                            severity="success"
                            size="large"
                            routerLink="/auth/register"
                            styleClass="px-8 py-4 text-lg font-bold rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all duration-300"
                        ></p-button>

                        <p-button
                            label="Ver demo"
                            [text]="true"
                            size="large"
                            icon="pi pi-play-circle"
                            iconPos="left"
                            routerLink="/auth/login"
                            styleClass="text-gray-400 hover:text-white hover:bg-white/5 px-8 py-4 rounded-xl transition-all"
                        ></p-button>
                    </div>
                </div>

                <!-- Hero Floating Code Window -->
                <div class="w-full max-w-4xl mx-auto mt-20 relative z-20">
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-30"
                    ></div>
                    <div
                        class="bg-[#0d1117] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <div
                            class="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/5"
                        >
                            <div
                                class="w-3 h-3 rounded-full bg-red-500/80"
                            ></div>
                            <div
                                class="w-3 h-3 rounded-full bg-yellow-500/80"
                            ></div>
                            <div
                                class="w-3 h-3 rounded-full bg-green-500/80"
                            ></div>
                            <span class="text-xs font-mono text-gray-500 ml-4"
                                >solucion.ts</span
                            >
                        </div>
                        <pre
                            class="text-sm md:text-base font-mono text-gray-300 bg-[#0d1117] p-6 overflow-x-auto leading-relaxed"
                        ><code><span class="text-emerald-400">function</span> <span class="text-blue-400">resolverProblema</span>(<span class="text-orange-400">problema</span>): <span class="text-teal-300">Solucion</span> {{ '{' }}
  <span class="text-emerald-400">const</span> <span class="text-green-400">solucion</span> = <span class="text-emerald-400">evaluar</span>(problema);
  <span class="text-emerald-400">return</span> optimizacion(solucion);
{{ '}' }}

<span class="text-gray-500">// Ejecutando evaluación...</span>
<span class="text-emerald-400">✓</span> <span class="text-gray-400">Test Case 1: Rendimiento</span> <span class="text-gray-600">........</span> <span class="text-emerald-400">PASS (12ms)</span>
<span class="text-emerald-400">✓</span> <span class="text-gray-400">Test Case 2: Casos límite</span> <span class="text-gray-600">......</span> <span class="text-emerald-400">PASS (08ms)</span>
<span class="text-emerald-400">✓</span> <span class="text-gray-400">Test Case 3: Memoria</span> <span class="text-gray-600">............</span> <span class="text-emerald-400">PASS (2.1MB)</span>

<span class="text-emerald-300 font-bold">¡Solución Aceptada! Has subido al puesto #42</span></code></pre>
                    </div>
                </div>
            </section>

            <!-- Features Grid -->
            <section
                class="py-24 px-6 md:px-12 bg-[#0f0f15] border-y border-white/5"
            >
                <div class="max-w-7xl mx-auto">
                    <div class="grid md:grid-cols-3 gap-6">
                        @for (card of featureCards; track card.title) {
                            <div
                                class="group p-8 rounded-2xl bg-[#12121a] border border-white/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6"
                                >
                                    <i
                                        [class]="
                                            'pi ' +
                                            card.icon +
                                            ' text-xl text-emerald-400'
                                        "
                                    ></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-3">
                                    {{ card.title }}
                                </h3>
                                <p
                                    class="text-gray-400 text-sm leading-relaxed"
                                >
                                    {{ card.description }}
                                </p>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <!-- Detailed Features -->
            <section id="features" class="py-32 px-6 md:px-12">
                <div
                    class="absolute right-0 top-1/4 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none"
                ></div>

                <div class="max-w-7xl mx-auto">
                    <div class="text-center mb-24">
                        <h2
                            class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                        >
                            Todo lo que necesitas para
                            <span class="text-emerald-400">destacar</span>
                        </h2>
                        <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                            Herramientas de grado profesional diseñadas para
                            llevar tu lógica y velocidad de programación al
                            siguiente nivel.
                        </p>
                    </div>

                    <div class="space-y-24">
                        @for (
                            feature of features;
                            track feature.title;
                            let i = $index
                        ) {
                            <div
                                class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                                [class.lg:grid-flow-col-dense]="true"
                            >
                                <div [class.lg:col-start-2]="i % 2 === 1">
                                    <span
                                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4"
                                    >
                                        <i
                                            class="pi pi-sparkles text-[10px]"
                                        ></i>
                                        {{ feature.tag }}
                                    </span>
                                    <h3
                                        class="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight"
                                    >
                                        {{ feature.title }}
                                    </h3>
                                    <p
                                        class="text-gray-400 text-base mb-6 leading-relaxed"
                                    >
                                        {{ feature.description }}
                                    </p>
                                    <ul class="space-y-3">
                                        @for (
                                            item of feature.items;
                                            track item
                                        ) {
                                            <li
                                                class="flex items-center gap-3 text-gray-300"
                                            >
                                                <div
                                                    class="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0"
                                                >
                                                    <i
                                                        class="pi pi-check text-xs text-emerald-400"
                                                    ></i>
                                                </div>
                                                <span
                                                    class="font-medium text-sm"
                                                    >{{ item }}</span
                                                >
                                            </li>
                                        }
                                    </ul>
                                </div>
                                <div
                                    [class.lg:col-start-1]="i % 2 === 1"
                                    class="relative"
                                >
                                    <div
                                        class="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl"
                                    ></div>
                                    <div
                                        class="bg-[#0d1117] rounded-xl p-1 border border-white/10 overflow-hidden"
                                    >
                                        <div
                                            class="flex items-center gap-2 px-4 py-2 bg-[#161b22] rounded-t-lg border-b border-white/5"
                                        >
                                            <div
                                                class="w-2.5 h-2.5 rounded-full bg-gray-600"
                                            ></div>
                                            <div
                                                class="w-2.5 h-2.5 rounded-full bg-gray-600"
                                            ></div>
                                            <div
                                                class="w-2.5 h-2.5 rounded-full bg-gray-600"
                                            ></div>
                                        </div>
                                        <pre
                                            class="text-xs font-mono text-gray-400 p-4 overflow-x-auto leading-relaxed"
                                        ><code [innerHTML]="feature.code"></code></pre>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <!-- How it works -->
            <section
                id="how"
                class="py-32 px-6 md:px-12 bg-[#0f0f15] border-t border-white/5"
            >
                <div class="max-w-5xl mx-auto">
                    <div class="text-center mb-16">
                        <h2
                            class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
                        >
                            ¿Cómo funciona?
                        </h2>
                        <p class="text-lg text-gray-400">
                            Tres simples pasos para entrar a la arena
                        </p>
                    </div>

                    <div class="relative">
                        <div
                            class="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
                        ></div>

                        <div class="grid md:grid-cols-3 gap-8 relative z-10">
                            @for (
                                step of steps;
                                track step.number;
                                let i = $index
                            ) {
                                <div class="relative text-center">
                                    <div
                                        class="w-20 h-20 rounded-2xl bg-[#12121a] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl"
                                    >
                                        <span
                                            class="text-3xl font-black text-white"
                                        >
                                            {{ step.number }}
                                        </span>
                                    </div>
                                    <h4
                                        class="text-xl font-bold text-white mb-3"
                                    >
                                        {{ step.title }}
                                    </h4>
                                    <p
                                        class="text-gray-400 text-sm leading-relaxed"
                                    >
                                        {{ step.description }}
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="py-24 px-6 md:px-12">
                <div class="max-w-4xl mx-auto">
                    <div class="relative group">
                        <div
                            class="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-500"
                        ></div>

                        <div
                            class="relative bg-[#12121a] rounded-2xl p-10 md:p-16 border border-white/10 overflow-hidden"
                        >
                            <div
                                class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
                            ></div>

                            <div class="text-center relative z-10">
                                <h2
                                    class="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
                                >
                                    ¿Listo para la
                                    <span class="text-emerald-400"
                                        >competencia?</span
                                    >
                                </h2>
                                <p class="text-gray-400 mb-8 max-w-xl mx-auto">
                                    Únete a miles de programadores que ya están
                                    mejorando su lógica y velocidad con Compex.
                                </p>
                                <div
                                    class="flex flex-col sm:flex-row gap-4 justify-center"
                                >
                                    <p-button
                                        label="Crear cuenta gratis"
                                        severity="success"
                                        size="large"
                                        routerLink="/auth/register"
                                        styleClass="px-8 py-3 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform w-full sm:w-auto"
                                    ></p-button>
                                    <p-button
                                        label="Iniciar sesión"
                                        [text]="true"
                                        size="large"
                                        routerLink="/auth/login"
                                        styleClass="px-8 py-3 font-semibold rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors w-full sm:w-auto"
                                    ></p-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Footer -->
            <footer
                class="py-10 px-6 md:px-12 border-t border-white/5 bg-[#0a0a0f]"
            >
                <div class="max-w-7xl mx-auto">
                    <div
                        class="flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div class="flex items-center gap-3">
                            <div
                                class="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                            >
                                <i class="pi pi-code text-gray-400 text-xs"></i>
                            </div>
                            <span class="text-sm font-bold text-gray-300">
                                Compex
                            </span>
                        </div>

                        <div
                            class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-500 text-sm"
                        >
                            <a
                                href="#"
                                class="hover:text-emerald-400 transition-colors"
                                >Términos</a
                            >
                            <a
                                href="#"
                                class="hover:text-emerald-400 transition-colors"
                                >Privacidad</a
                            >
                            <a
                                href="#"
                                class="hover:text-emerald-400 transition-colors"
                                >Contacto</a
                            >
                        </div>

                        <div class="text-gray-600 text-sm">© 2024 Compex</div>
                    </div>
                </div>
            </footer>
        </div>
    `,
})
export class LandingPageComponent implements OnInit {
    private router = inject(Router);

    codeLines: {
        id: number;
        x: string;
        text: string;
        duration: number;
        delay: number;
    }[] = [];

    featureCards = [
        {
            icon: 'pi-trophy',
            title: 'Competiciones en vivo',
            description:
                'Participa en desafíos de programación con evaluación automatizada y ranking global en tiempo real.',
        },
        {
            icon: 'pi-chart-line',
            title: 'Análisis profundo',
            description:
                'Estadísticas detalladas de tu desempeño, velocidad, uso de memoria e identificación de áreas de mejora.',
        },
        {
            icon: 'pi-users',
            title: 'Comunidad activa',
            description:
                'Conecta con otros programadores top, forma equipos invencibles y colabora en torneos masivos.',
        },
    ];

    features = [
        {
            tag: 'Problemas',
            title: 'Biblioteca de desafíos',
            description:
                'Miles de problemas organizados por dificultad y categoría. Practica con casos reales y prepárate para entrevistas en las mejores empresas tech.',
            items: [
                'Múltiples lenguajes soportados',
                'Casos de prueba exhaustivos',
                'Evaluación instantánea',
            ],
            code: `<span class="text-emerald-400">const</span> <span class="text-blue-400">problema</span> = {
  <span class="text-orange-400">id</span>: <span class="text-green-400">42</span>,
  <span class="text-orange-400">titulo</span>: <span class="text-green-400">"Árboles Binarios Invertidos"</span>,
  <span class="text-orange-400">dificultad</span>: <span class="text-yellow-400">"Hard"</span>,
  <span class="text-orange-400">tiempo_max</span>: <span class="text-green-400">"2000ms"</span>
};

<span class="text-emerald-400">await</span> engine.resolver(problema);
<span class="text-green-400 font-bold">✓</span> <span class="text-gray-400">¡Reto completado con éxito!</span>`,
        },
        {
            tag: 'Ranking',
            title: 'Tabla de posiciones global',
            description:
                'Compite con otros desarrolladores alrededor del mundo y escala posiciones. Demuestra quién es el más eficiente resolviendo algoritmos complejos.',
            items: [
                'Posiciones en vivo',
                'Sistema de Ligas (Elo)',
                'Métricas de progreso',
            ],
            code: `<span class="text-gray-500">// Estado de tu perfil competitivo</span>
<span class="text-emerald-400">const</span> <span class="text-blue-400">rank</span> = {
  <span class="text-orange-400">liga</span>: <span class="text-green-400">"Diamante II"</span>,
  <span class="text-orange-400">posicion_global</span>: <span class="text-green-400">#147</span>,
  <span class="text-orange-400">elo_rating</span>: <span class="text-green-400">2840</span>
};

<span class="text-emerald-400">if</span> (rank.elo_rating > anterior) {
  <span class="text-yellow-400">🏆</span> <span class="text-gray-400">¡Ascendiste de división!</span>
}`,
        },
        {
            tag: 'Feedback',
            title: 'Retroalimentación precisa',
            description:
                'Recibe análisis detallados de la complejidad de tu código (Big O). Mejora continuamente entendiendo no solo si funciona, sino cómo optimizarlo.',
            items: [
                'Análisis de Complejidad Temporal',
                'Uso de Memoria',
                'Refactorizaciones sugeridas',
            ],
            code: `<span class="text-emerald-400">const</span> <span class="text-blue-400">analisis</span> = {
  <span class="text-orange-400">tiempo</span>: <span class="text-green-400">"O(n log n)"</span>,
  <span class="text-orange-400">memoria</span>: <span class="text-green-400">"O(1)"</span>,
  <span class="text-orange-400">puntuacion</span>: <span class="text-green-400">98/100</span>,
  <span class="text-orange-400">sugerencia</span>: <span class="text-yellow-400">"Excelente uso de punteros. Podrías evitar la variable auxiliar en la línea 12."</span>
};

<span class="text-emerald-400">console</span>.<span class="text-blue-400">log</span>(<span class="text-green-400">"Código optimizado al máximo"</span>);`,
        },
    ];

    steps = [
        {
            number: 1,
            title: 'Regístrate',
            description:
                'Crea tu perfil de desarrollador en segundos y configura tus lenguajes favoritos.',
        },
        {
            number: 2,
            title: 'Únete a la arena',
            description:
                'Explora torneos activos, retos diarios o practica en solitario a tu ritmo.',
        },
        {
            number: 3,
            title: 'Demuestra tu skill',
            description:
                'Sube tu código, supera los casos de prueba cerrados y conquista el ranking.',
        },
    ];

    ngOnInit(): void {
        const texts = [
            'const x = 42;',
            'if (a > b)',
            'return true;',
            'for (let i = 0)',
            'array.map(x => x * 2)',
            'import { core }',
            'async function()',
            'await Promise.all()',
            '...spread_operator',
            '{ key: val }',
            'O(n log n)',
            'try { execute() }',
        ];

        this.codeLines = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: String(Math.random() * 100),
            text: texts[Math.floor(Math.random() * texts.length)],
            duration: 10 + Math.random() * 15,
            delay: Math.random() * 15,
        }));
    }
}
