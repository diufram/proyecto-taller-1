import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import { AdminDashboardStats } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private api = inject(ApiService);

    getAdminStats(): Observable<AdminDashboardStats> {
        return this.api.get<AdminDashboardStats>('dashboard/admin');
    }
}
