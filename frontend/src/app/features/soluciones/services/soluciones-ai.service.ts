import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@/core/services/http/api.service';
import {
    SugerenciaIA,
    SugerirCalificacionRequest,
} from '../models/solucion.model';

@Injectable({
    providedIn: 'root',
})
export class SolucionesAiService {
    private api = inject(ApiService);

    private endpoint = 'soluciones';

    sugerir(
        solucionId: number,
        body?: SugerirCalificacionRequest,
    ): Observable<{ sugerencia: SugerenciaIA; message: string }> {
        return this.api.post<{
            sugerencia: SugerenciaIA;
            message: string;
        }>(`${this.endpoint}/${solucionId}/sugerir-calificacion`, body ?? {});
    }
}
