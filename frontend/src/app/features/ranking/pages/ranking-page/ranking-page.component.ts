import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';
import { RankingService } from '../../services/ranking.service';
import { RankingUser, MyRankingStats } from '../../models/ranking.model';

@Component({
    selector: 'app-ranking-page',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TagModule,
        AvatarModule,
        ButtonModule,
        ProgressSpinnerModule,
    ],
    templateUrl: './ranking-page.component.html',
    styleUrl: './ranking-page.component.scss',
})
export class RankingPageComponent implements OnInit {
    private rankingService = inject(RankingService);

    rankingData: RankingUser[] = [];
    currentUser: MyRankingStats | null = null;
    loading = true;
    error: string | null = null;

    ngOnInit(): void {
        this.loadRanking();
    }

    loadRanking(): void {
        this.loading = true;
        this.error = null;

        forkJoin({
            ranking: this.rankingService.getGlobalRanking(20),
            mine: this.rankingService.getMyStats(),
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

    getPositionClass(position: number): string {
        switch (position) {
            case 1: return 'gold';
            case 2: return 'silver';
            case 3: return 'bronze';
            default: return 'normal';
        }
    }

    getMedalIcon(position: number): string {
        switch (position) {
            case 1: return 'pi pi-trophy';
            case 2: return 'pi pi-star';
            case 3: return 'pi pi-star-fill';
            default: return '';
        }
    }

    getTrendIcon(trend: string): string {
        switch (trend) {
            case 'up': return 'pi pi-arrow-up';
            case 'down': return 'pi pi-arrow-down';
            default: return 'pi pi-minus';
        }
    }
}
