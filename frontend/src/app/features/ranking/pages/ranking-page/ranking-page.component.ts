import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, forkJoin, of } from 'rxjs';
import { RankingService } from '../../services/ranking.service';
import { RankingUser, MyRankingStats } from '../../models/ranking.model';
import { AuthService } from '@/features/auth/services/auth.service';

@Component({
    selector: 'app-ranking-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TagModule,
        ButtonModule,
        ProgressSpinnerModule,
    ],
    styleUrl: './ranking-page.component.scss',
    template: `
        <div class="ranking-page">
            <header class="ranking-hero">
                <div class="ranking-hero-content">
                    <span class="eyebrow">Leaderboard</span>
                    <h1 class="ranking-title">Ranking de Competidores</h1>
                    <p class="ranking-subtitle">
                        Mira quién domina la arena, compara puntos y sigue el
                        avance de los mejores participantes.
                    </p>
                </div>
                <div class="ranking-hero-stats" aria-label="Resumen del ranking">
                    <div class="hero-stat">
                        <span class="hero-stat-value">{{ rankingData.length }}</span>
                        <span class="hero-stat-label">Rankeados</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-value">{{ totalPoints }}</span>
                        <span class="hero-stat-label">Puntos</span>
                    </div>
                    <div class="hero-stat">
                        <span class="hero-stat-value">{{ totalSolved }}</span>
                        <span class="hero-stat-label">Resueltos</span>
                    </div>
                </div>
            </header>

            @if (loading) {
                <div class="ranking-loading">
                    <p-progressSpinner
                        styleClass="w-4rem h-4rem"
                        strokeWidth="4"
                    ></p-progressSpinner>
                </div>
            }

            @if (error && !loading) {
                <div class="error-card">
                    <i class="pi pi-exclamation-triangle"></i>
                    <p>{{ error }}</p>
                    <p-button
                        label="Reintentar"
                        icon="pi pi-refresh"
                        (onClick)="loadRanking()"
                    ></p-button>
                </div>
            }

            @if (!loading && !error) {
                @if (showMyPosition && currentUser) {
                    <article class="my-stats-card">
                        <div class="my-stats-row">
                            <div class="my-stats-identity">
                                <div class="avatar-circle">
                                    <i class="pi pi-user"></i>
                                </div>
                                <div>
                                    <span class="label">Tu posición actual</span>
                                    <div class="position-line">
                                        <span class="position-number"
                                            >#{{ currentUserPosition }}</span
                                        >
                                        <p-tag
                                            value="Ranking"
                                            severity="success"
                                        ></p-tag>
                                    </div>
                                </div>
                            </div>
                            <div class="my-stats-numbers">
                                <div class="stat-item">
                                    <span class="label">Puntos</span>
                                    <span class="value text-emerald">
                                        {{ currentUserPoints }}
                                    </span>
                                </div>
                                <div class="stat-item">
                                    <span class="label">Resueltos</span>
                                    <span class="value">{{
                                        currentUserSolved
                                    }}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="label">Competencias</span>
                                    <span class="value">{{
                                        currentUserCompetitions
                                    }}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                } @else {
                    <article class="login-cta">
                        <i class="pi pi-info-circle"></i>
                        <div>
                            <p class="login-cta-title">
                                Inicia sesión para ver tu posición
                            </p>
                            <p class="login-cta-sub">
                                El ranking global es público. Crea una cuenta
                                o inicia sesión para ver tu lugar y seguir tu
                                progreso.
                            </p>
                        </div>
                        <p-button
                            label="Iniciar sesión"
                            icon="pi pi-sign-in"
                            (onClick)="goToLogin()"
                        ></p-button>
                    </article>
                }

                @if (rankingData.length > 0) {
                    <section class="podium-section" aria-label="Podio principal">
                        <div class="section-heading">
                            <span>Top 3</span>
                            <strong>Podio principal</strong>
                        </div>
                    <div class="podium-grid">
                        @for (user of rankingData.slice(0, 3); track user.userId) {
                            <article
                                class="podium-card"
                                [class]="'podium-' + user.position"
                            >
                                <div
                                    class="podium-medal"
                                    [class]="getPositionClass(user.position)"
                                >
                                    <i
                                        [class]="getMedalIcon(user.position)"
                                    ></i>
                                </div>
                                <div class="podium-avatar">
                                    {{ user.name.charAt(0) }}
                                </div>
                                <span class="podium-position">#{{ user.position }}</span>
                                <span class="podium-name">{{ user.name }}</span>
                                <span class="podium-handle"
                                    >&#64;{{ user.username }}</span
                                >
                                <div class="podium-stats">
                                    <div>
                                        <span class="label">Puntos</span>
                                        <span class="value text-emerald">{{
                                            user.points
                                        }}</span>
                                    </div>
                                    <div>
                                        <span class="label">Resueltos</span>
                                        <span class="value">{{
                                            user.solvedProblems
                                        }}</span>
                                    </div>
                                </div>
                            </article>
                        }
                    </div>
                    </section>

                    @if (rankingData.length > 3) {
                        <article class="ranking-list-card">
                            <header class="ranking-list-header">
                                <div>
                                    <span class="ranking-list-kicker">General</span>
                                    <span class="ranking-list-title"
                                        >Clasificación completa</span
                                    >
                                </div>
                                <span class="ranking-list-count">
                                    {{ rankingData.length - 3 }} competidores
                                </span>
                            </header>
                            <div class="ranking-list">
                                @for (
                                    user of rankingData.slice(3);
                                    track user.userId
                                ) {
                                    <div class="ranking-item">
                                        <div
                                            class="position-badge"
                                            [class]="
                                                getPositionClass(user.position)
                                            "
                                        >
                                            <span>{{ user.position }}</span>
                                        </div>
                                        <div class="ranking-avatar">
                                            {{ user.name.charAt(0) }}
                                        </div>
                                        <div class="ranking-name">
                                            <span
                                                class="ranking-name-primary"
                                                >{{ user.name }}</span
                                            >
                                            <span class="ranking-name-secondary"
                                                >&#64;{{ user.username }}</span
                                            >
                                        </div>
                                        <div class="ranking-mobile-points">
                                            <span>{{ user.points }}</span>
                                            <small>pts</small>
                                        </div>
                                        <div class="ranking-stats">
                                            <div class="ranking-stat hidden sm:block">
                                                <span class="label">Puntos</span>
                                                <span class="value text-emerald">{{
                                                    user.points
                                                }}</span>
                                            </div>
                                            <div class="ranking-stat hidden sm:block">
                                                <span class="label">Resueltos</span>
                                                <span class="value">{{
                                                    user.solvedProblems
                                                }}</span>
                                            </div>
                                            <div class="ranking-stat hidden sm:block">
                                                <span class="label">Competencias</span>
                                                <span class="value">{{
                                                    user.competitions
                                                }}</span>
                                            </div>
                                            <i
                                                [class]="getTrendIcon(user.trend)"
                                                class="trend-icon"
                                                [class.trend-up]="user.trend === 'up'"
                                                [class.trend-down]="
                                                    user.trend === 'down'
                                                "
                                                [class.trend-flat]="
                                                    user.trend !== 'up' &&
                                                    user.trend !== 'down'
                                                "
                                            ></i>
                                        </div>
                                    </div>
                                }
                            </div>
                        </article>
                    }
                } @else {
                    <div class="empty-state">
                        <i class="pi pi-users"></i>
                        <p>Aún no hay participantes en el ranking.</p>
                        <p class="empty-state-sub">
                            ¡Sé el primero en resolver un problema!
                        </p>
                    </div>
                }
            }
        </div>
    `,
})
export class RankingPageComponent implements OnInit {
    private rankingService = inject(RankingService);
    private authService = inject(AuthService);
    private router = inject(Router);

    rankingData: RankingUser[] = [];
    currentUser: MyRankingStats | null = null;
    showMyPosition = false;
    loading = true;
    error: string | null = null;

    ngOnInit(): void {
        this.showMyPosition = this.authService.isAuthenticated();
        this.loadRanking();
    }

    loadRanking(): void {
        this.loading = true;
        this.error = null;

        const mine$ = this.showMyPosition
            ? this.rankingService.getMyStats().pipe(
                  catchError(() => of(null)),
              )
            : of(null);

        forkJoin({
            ranking: this.rankingService.getGlobalRanking(20),
            mine: mine$,
        }).subscribe({
            next: ({ ranking, mine }) => {
                this.rankingData = ranking.ranking;
                this.currentUser = mine;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al cargar el ranking:', err);
                this.error =
                    err?.message || 'No se pudo cargar el ranking.';
                this.loading = false;
            },
        });
    }

    goToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    get currentUserPosition(): number {
        return this.currentUser?.position ?? 0;
    }

    get currentUserPoints(): number {
        return this.currentUser?.points ?? 0;
    }

    get currentUserSolved(): number {
        return this.currentUser?.solvedProblems ?? 0;
    }

    get currentUserCompetitions(): number {
        return this.currentUser?.competitions ?? 0;
    }

    get totalPoints(): number {
        return this.rankingData.reduce((total, user) => total + user.points, 0);
    }

    get totalSolved(): number {
        return this.rankingData.reduce(
            (total, user) => total + user.solvedProblems,
            0,
        );
    }

    getPositionClass(position: number): string {
        switch (position) {
            case 1:
                return 'gold';
            case 2:
                return 'silver';
            case 3:
                return 'bronze';
            default:
                return 'normal';
        }
    }

    getMedalIcon(position: number): string {
        switch (position) {
            case 1:
                return 'pi pi-trophy';
            case 2:
                return 'pi pi-star';
            case 3:
                return 'pi pi-star-fill';
            default:
                return '';
        }
    }

    getTrendIcon(trend: string): string {
        switch (trend) {
            case 'up':
                return 'pi pi-arrow-up';
            case 'down':
                return 'pi pi-arrow-down';
            default:
                return 'pi pi-minus';
        }
    }
}
