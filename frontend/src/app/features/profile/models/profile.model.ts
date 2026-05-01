export interface Profile {
    person_id: number;
    first_name: string;
    last_name: string;
    photo?: string;

    user_id: number;
    email: string;
    username: string;
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
