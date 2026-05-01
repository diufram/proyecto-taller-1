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

import { ToastService } from '@/core/services/toast.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '@/features/auth/services/auth.service';

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
    ],
    templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
    private profileService = inject(ProfileService);
    private fb = inject(FormBuilder);
    private toast = inject(ToastService);
    private authService = inject(AuthService);

    profile?: Profile;
    loading = false;
    savingUsername = false;
    savingPassword = false;
    checkingUsername = false;
    usernameAvailable = true;

    usernameForm: FormGroup;
    passwordForm: FormGroup;

    constructor() {
        this.usernameForm = this.fb.group({
            username: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ],
            ],
            current_password: ['', Validators.required],
        });

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
                    this.usernameForm.patchValue({
                        username: profile.username,
                    });
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

    checkUsernameAvailability() {
        const username = this.usernameForm.get('username')?.value;
        if (!username || username === this.profile?.username) {
            this.usernameAvailable = true;
            return;
        }

        this.checkingUsername = true;
        this.profileService
            .checkUsernameAvailability(username)
            .pipe(finalize(() => (this.checkingUsername = false)))
            .subscribe({
                next: (response) => {
                    this.usernameAvailable = response.available;
                    if (!response.available) {
                        this.toast.error('Username no disponible');
                    }
                },
            });
    }

    onUsernameSubmit() {
        if (this.usernameForm.invalid || !this.usernameAvailable) {
            this.usernameForm.markAllAsTouched();
            return;
        }

        this.savingUsername = true;
        this.profileService
            .updateUsername(this.usernameForm.value)
            .pipe(finalize(() => (this.savingUsername = false)))
            .subscribe({
                next: (profile) => {
                    this.profile = profile;
                    this.toast.success('Username actualizado exitosamente');
                    this.usernameForm.patchValue({ current_password: '' });
                },
                error: (err) => {
                    if (err.error?.message?.includes('contraseña')) {
                        this.toast.error('Contraseña incorrecta');
                    } else {
                        this.toast.error('Error al actualizar username');
                    }
                },
            });
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

    getInitials(): string {
        if (!this.profile) return '?';
        return `${this.profile.first_name[0]}${this.profile.last_name[0]}`.toUpperCase();
    }

    logout(): void {
        this.authService.logout();
    }
}