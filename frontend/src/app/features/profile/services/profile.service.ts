import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/http/api.service';
import { Profile, ChangePasswordRequest } from '../models/profile.model';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = inject(ApiService);

    getProfile(): Observable<Profile> {
        return this.api.get<Profile>('profile');
    }

    changePassword(data: ChangePasswordRequest): Observable<void> {
        return this.api.put<void>('profile/password', data);
    }
}
