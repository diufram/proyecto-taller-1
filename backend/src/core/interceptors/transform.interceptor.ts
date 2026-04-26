import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Si el controlador ya envía un mensaje personalizado, lo extraemos
        const message = data?.message;
        if (data && typeof data === 'object' && 'message' in data) {
          delete data.message;
        }

        return {
          status: 'success', // Obligatorio. Siempre debe ser "success".
          data: data || {}, // Si es 204 No Content, devuelve objeto vacío [cite: 21]
          ...(message && { message }), // Opcional: Mensaje de confirmación [cite: 17]
        };
      }),
    );
  }
}
