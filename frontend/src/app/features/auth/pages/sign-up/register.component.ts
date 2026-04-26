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
    selector: 'app-register',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        MyFloatingConfigurator,
    ],
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
    nombre_usuario: string = '';
    correo_electronico: string = '';
    contrasena: string = '';
    confirmarContrasena: string = '';
    loading: boolean = false;

    private router = inject(Router);
    private authService = inject(AuthService);
    private toast = inject(ToastService);

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
        }
    }

    onRegister() {
        if (!this.nombre_usuario || !this.correo_electronico || !this.contrasena) {
            this.toast.warn('Atencion', 'Complete todos los campos.');
            return;
        }

        if (this.contrasena !== this.confirmarContrasena) {
            this.toast.warn('Atencion', 'Las contrasenas no coinciden.');
            return;
        }

        if (this.contrasena.length < 8) {
            this.toast.warn('Atencion', 'La contrasena debe tener al menos 8 caracteres.');
            return;
        }

        this.loading = true;

        this.authService
            .register({
                nombre_usuario: this.nombre_usuario,
                correo_electronico: this.correo_electronico,
                contrasena: this.contrasena,
            })
            .subscribe({
                next: () => {
                    this.toast.success('Exito', 'Cuenta creada correctamente.');
                    this.loading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    console.error('Error en registro:', err);
                    this.loading = false;
                    const msg = err?.message || 'No se pudo crear la cuenta.';
                    this.toast.error('Error', msg);
                },
            });
    }
}