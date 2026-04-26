import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import { KPIStats, ChartData, MapPoint } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private api = inject(ApiService);

    // ✅ CAMBIO: Recibe orgId
    getKPIs(orgId: number, start?: string, end?: string): Observable<KPIStats> {
        let params = new HttpParams();
        if (start) params = params.set('start', start);
        if (end) params = params.set('end', end);

        return this.api.get<KPIStats>(`dashboard/organization/${orgId}/kpis`, {
            params,
        });
    }

    // ✅ CAMBIO: Recibe orgId
    getChart(
        orgId: number,
        metric: 'attendance' | 'offering',
        start?: string,
        end?: string,
    ): Observable<ChartData[]> {
        let params = new HttpParams().set('metric', metric);
        if (start) params = params.set('start', start);
        if (end) params = params.set('end', end);

        return this.api.get<ChartData[]>(
            `dashboard/organization/${orgId}/chart`,
            { params },
        );
    }

    // ✅ CAMBIO: Recibe orgId
    getMapData(orgId: number): Observable<MapPoint[]> {
        return this.api.get<MapPoint[]>(`dashboard/organization/${orgId}/map`);
    }
}
