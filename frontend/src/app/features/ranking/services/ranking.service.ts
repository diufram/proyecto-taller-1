import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    RankingResponse,
    MyRankingStats,
} from '../models/ranking.model';

@Injectable({
    providedIn: 'root',
})
export class RankingService {
    private api = inject(ApiService);
    private endpoint = 'ranking';

    getGlobalRanking(limit = 20): Observable<RankingResponse> {
        return this.api.get<RankingResponse>(this.endpoint, {
            params: { limit },
        });
    }

    getMyStats(): Observable<MyRankingStats> {
        return this.api.get<MyRankingStats>(`${this.endpoint}/me`);
    }
}
