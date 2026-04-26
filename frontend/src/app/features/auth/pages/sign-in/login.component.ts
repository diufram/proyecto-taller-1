import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '@/core/services/toast.service';
import { MyFloatingConfigurator } from '@/core/layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        MyFloatingConfigurator,
    ],
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    correo_electronico: string = '';
    contrasena: string = '';
    loading: boolean = false;

    private router = inject(Router);
    private authService = inject(AuthService);
    private toast = inject(ToastService);

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    onLogin() {
        if (!this.correo_electronico || !this.contrasena) {
            this.toast.warn(
                'Atención',
                'Por favor completa el correo electrónico y la contraseña',
            );
            return;
        }

        this.loading = true;

        this.authService
            .login({
                correo_electronico: this.correo_electronico,
                contrasena: this.contrasena,
            })
            .subscribe({
                next: () => {
                    this.toast.success(
                        '¡Bienvenido!',
                        'Sesión iniciada correctamente',
                    );
                    this.loading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    console.error('❌ Error en login:', error);
                    this.loading = false;
                    const errorMsg =
                        error?.message || 'Error al iniciar sesión';
                    this.toast.error('Error', errorMsg);
                },
            });
    }
}
