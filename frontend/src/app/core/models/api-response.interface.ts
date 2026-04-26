export type ApiStatus = 'success' | 'fail' | 'error';

export interface ApiResponseBase {
  status: ApiStatus;
  message?: string | null;
}

// success
export interface SuccessResponse<T> extends ApiResponseBase {
  status: 'success';
  data: T;
}

// fail
export interface ValidationError {
  campo: string;
  codigo: string;
  mensaje: string;
}

export interface FailResponse extends ApiResponseBase {
  status: 'fail';
  data: {
    errores_validacion: ValidationError[];
  };
}

// error
export interface ErrorResponse extends ApiResponseBase {
  status: 'error';
  code?: string;
  trace_id?: string;
}
