import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { Problema } from '../../models/problema.model';

@Component({
    selector: 'app-problema-delete-modal',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="'Eliminar Problema'"
            [modal]="true"
            [style]="{ width: '400px' }"
            [closable]="true"
            [closeOnEscape]="true"
            (onHide)="close()"
        >
            <div class="flex flex-col gap-4 p-2">
                <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-3xl text-red-500"></i>
                    <p class="m-0 text-base">
                        ¿Está seguro de eliminar el problema
                        <strong>{{ target?.titulo }}</strong
                        >? Esta acción no se puede deshacer.
                    </p>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex justify-end gap-2">
                    <p-button
                        label="Cancelar"
                        [text]="true"
                        severity="secondary"
                        (onClick)="close()"
                    ></p-button>
                    <p-button
                        label="Eliminar"
                        severity="danger"
                        [loading]="deleting"
                        (onClick)="confirmDelete()"
                    ></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `,
})
export class ProblemaDeleteModalComponent {
    @Input() visible = false;
    @Input() target?: Problema;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() onDeleted = new EventEmitter<void>();

    deleting = false;

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    confirmDelete(): void {
        this.deleting = true;
        this.onDeleted.emit();
        setTimeout(() => {
            this.deleting = false;
            this.close();
        }, 500);
    }
}