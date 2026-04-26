// Lo que envías
export interface LoginRequest {
    email: string;
    password: string;
}

// Lo que recibes (La "T" de tu ApiService)
// Ya NO ponemos 'status' ni 'message' aquí porque el ApiService los procesa antes.
export interface LoginResponseData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}