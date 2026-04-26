import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/http/api.service';
import {
    Profile,
    UpdateUsernameRequest,
    ChangePasswordRequest,
    CheckUsernameResponse,
} from '../models/profile.model';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private api = inject(ApiService);

    getProfile(): Observable<Profile> {
        return this.api.get<Profile>('profile');
    }

    updateUsername(data: UpdateUsernameRequest): Observable<Profile> {
        return this.api.put<Profile>('profile/username', data);
    }

    changePassword(data: ChangePasswordRequest): Observable<void> {
        return this.api.put<void>('profile/password', data);
    }

    checkUsernameAvailability(
        username: string,
    ): Observable<CheckUsernameResponse> {
        return this.api.get<CheckUsernameResponse>('profile/check-username', {
            params: { username },
        });
    }
}
