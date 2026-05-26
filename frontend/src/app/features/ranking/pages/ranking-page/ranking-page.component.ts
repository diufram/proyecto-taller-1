import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

interface RankingUser {
    position: number;
    name: string;
    username: string;
    points: number;
    solvedProblems: number;
    competitions: number;
    trend: 'up' | 'down' | 'stable';
}

@Component({
    selector: 'app-ranking-page',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TagModule,
        AvatarModule,
        ButtonModule,
    ],
    templateUrl: './ranking-page.component.html',
    styleUrl: './ranking-page.component.scss',
})
export class RankingPageComponent implements OnInit {
    rankingData: RankingUser[] = [
        {
            position: 1,
            name: 'Carlos Mendez',
            username: 'cmendez',
            points: 1250,
            solvedProblems: 45,
            competitions: 8,
            trend: 'up',
        },
        {
            position: 2,
            name: 'Ana Rodriguez',
            username: 'arodriguez',
            points: 1180,
            solvedProblems: 42,
            competitions: 7,
            trend: 'stable',
        },
        {
            position: 3,
            name: 'Luis Garcia',
            username: 'lgarcia',
            points: 1050,
            solvedProblems: 38,
            competitions: 6,
            trend: 'up',
        },
        {
            position: 4,
            name: 'Maria Lopez',
            username: 'mlopez',
            points: 980,
            solvedProblems: 35,
            competitions: 6,
            trend: 'down',
        },
        {
            position: 5,
            name: 'Pedro Sanchez',
            username: 'psanchez',
            points: 920,
            solvedProblems: 33,
            competitions: 5,
            trend: 'stable',
        },
        {
            position: 6,
            name: 'Laura Torres',
            username: 'ltorres',
            points: 890,
            solvedProblems: 31,
            competitions: 5,
            trend: 'up',
        },
        {
            position: 7,
            name: 'Diego Ramirez',
            username: 'dramirez',
            points: 850,
            solvedProblems: 30,
            competitions: 5,
            trend: 'down',
        },
        {
            position: 8,
            name: 'Sofia Castro',
            username: 'scastro',
            points: 820,
            solvedProblems: 29,
            competitions: 4,
            trend: 'stable',
        },
    ];

    currentUserPosition = 12;
    currentUserPoints = 650;
    currentUserSolved = 23;
    currentUserCompetitions = 4;

    ngOnInit(): void {}

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