import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

import { ToastService } from '@/core/services/toast.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { environment } from '../../../../../environments/environment';


@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FloatLabelModule,
        AvatarModule,
        TagModule,
        ToastModule,
        CardModule,
    ],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
    private profileService = inject(ProfileService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);

    profile?: Profile;
    loading = false;
    savingPassword = false;

    passwordForm: FormGroup;

    constructor() {
        this.passwordForm = this.fb.group(
            {
                current_password: ['', Validators.required],
                new_password: [
                    '',
                    [Validators.required, Validators.minLength(8)],
                ],
                confirm_password: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator },
        );
    }

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.loading = true;
        this.profileService
            .getProfile()
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (profile) => {
                    this.profile = profile;
                },
                error: () => {
                    this.toast.error('Error al cargar el perfil');
                },
            });
    }

    isInvalid(fieldName: string, form: FormGroup): boolean {
        const control = form.get(fieldName);
        return !!(
            control &&
            control.invalid &&
            (control.dirty || control.touched)
        );
    }

    onPasswordSubmit() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        this.savingPassword = true;
        this.profileService
            .changePassword(this.passwordForm.value)
            .pipe(finalize(() => (this.savingPassword = false)))
            .subscribe({
                next: () => {
                    this.toast.success('Contraseña actualizada exitosamente');
                    this.passwordForm.reset();
                },
                error: (err) => {
                    if (err.error?.message?.includes('contraseña')) {
                        this.toast.error('Contraseña actual incorrecta');
                    } else {
                        this.toast.error('Error al cambiar contraseña');
                    }
                },
            });
    }

    passwordMatchValidator(
        group: FormGroup,
    ): { [key: string]: boolean } | null {
        const newPassword = group.get('new_password')?.value;
        const confirmPassword = group.get('confirm_password')?.value;
        return newPassword === confirmPassword ? null : { mismatch: true };
    }

    hasPasswordMismatch(): boolean {
        return !!(
            this.passwordForm.errors?.['mismatch'] &&
            this.passwordForm.get('confirm_password')?.dirty &&
            this.passwordForm.get('confirm_password')?.touched
        );
    }

    getPhotoUrl(): string {
        if (this.profile?.photo) {
            const baseUrl = environment.apiUrl.replace('/api', '');
            return `${baseUrl}/uploads/${this.profile.photo}`;
        }
        return '';
    }

    hasPhoto(): boolean {
        return !!this.profile?.photo;
    }

    get displayName(): string {
        if (!this.profile) return 'Usuario';
        const fullName = `${this.profile.first_name ?? ''} ${this.profile.last_name ?? ''}`.trim();
        return fullName || this.profile.email;
    }

    getInitials(): string {
        if (!this.profile) return '?';
        const first = this.profile.first_name?.[0] ?? '';
        const last = this.profile.last_name?.[0] ?? '';
        if (!first && !last) return this.profile.email?.[0]?.toUpperCase() ?? '?';
        return `${first}${last}`.toUpperCase();
    }
}
