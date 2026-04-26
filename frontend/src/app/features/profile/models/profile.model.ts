export interface Profile {
    // Datos de Person (solo lectura)
    person_id: number;
    first_name: string;
    last_name: string;
    photo?: string;
    
    // Datos de User
    user_id: number;
    email: string;
    username: string;
    url_image?: string;
    is_verified: boolean;
}

export interface UpdateUsernameRequest {
    username: string;
    current_password: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export interface CheckUsernameResponse {
    available: boolean;
    message?: string;
}
