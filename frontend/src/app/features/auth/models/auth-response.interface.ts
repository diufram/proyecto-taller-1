export interface LoginRequest {
    correo_electronico: string;
    contrasena: string;
}

export interface RegisterRequest {
    nombre_usuario: string;
    correo_electronico: string;
    contrasena: string;
}

export interface Usuario {
    id: number;
    nombre_usuario: string;
    correo_electronico: string;
    rol: string;
    created_at: string;
    updated_at: string;
}

export interface LoginResponseData {
    usuario: Usuario;
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    message?: string;
}
