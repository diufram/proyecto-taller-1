import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/features/auth/services/auth.service';
import { MaterialModule } from '@/core/modules/material/material.module';
import { ButtonDirective } from "primeng/button";

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [CommonModule, MaterialModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardPage implements OnInit {
    private authService = inject(AuthService);

    ngOnInit(): void {}

    currentUser() {
        return this.authService.currentUser();
    }
}
