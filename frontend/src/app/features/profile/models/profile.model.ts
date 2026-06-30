export interface Profile {
    person_id: number | null;
    first_name: string;
    last_name: string;
    photo?: string;

    user_id: number;
    email: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
    confirm_password: string;
}
