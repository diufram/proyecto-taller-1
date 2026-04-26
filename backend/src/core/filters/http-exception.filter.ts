import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Determinar el código de estado HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraer la respuesta original de NestJS (útil para validaciones)
    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    // 1. Manejo de Errores del Cliente (4XX) -> "fail"
    if (status >= 400 && status < 500) {
      // Formatear los errores de validación si existen (típico del ValidationPipe de Nest)
      let erroresValidacion = [];
      if (
        typeof exceptionResponse === 'object' &&
        Array.isArray(exceptionResponse.message)
      ) {
        erroresValidacion = exceptionResponse.message.map(
          (msg: string, index: number) => ({
            campo: msg.split(' ')[0], // Aproximación, depende de tu validador
            codigo: `E400-${index}`,
            mensaje: msg,
          }),
        );
      }

      return response.status(status).json({
        status: 'fail', // Obligatorio. Siempre debe ser "fail". [cite: 50]
        data:
          erroresValidacion.length > 0
            ? { errores_validacion: erroresValidacion }
            : exceptionResponse, // [cite: 31, 51]
        message:
          exceptionResponse?.error || 'Fallo en la petición del cliente.', // [cite: 49]
      });
    }

    // 2. Manejo de Errores del Servidor (5XX) -> "error" [cite: 54, 58]
    // Generamos un ID de correlación único para buscar en logs [cite: 61, 65]
    const traceId = `T${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Aquí deberías registrar el error real en tu sistema de logs (ej. Winston o Pino)
    console.error(`[${traceId}] Error Interno:`, exception);

    return response.status(status).json({
      status: 'error', // Obligatorio. Siempre debe ser "error". [cite: 63]
      code: `E${status}`, // Código de error interno del servidor [cite: 59]
      message:
        'Ha ocurrido un error inesperado. Por favor, contacte a soporte con el código de traza.', // Mensaje genérico seguro [cite: 60, 64]
      trace_id: traceId, // ID de correlación [cite: 61, 65]
    });
  }
}
