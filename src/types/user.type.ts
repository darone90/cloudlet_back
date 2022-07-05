export interface UserResponse {
    status: boolean;
    info: string;
}

export interface Code {
    coded: string;
    iv: string
}

export interface databaseUserForm {
    id?: string;
    email: string;
    login: string;
    password: string;
    active?: boolean;
    activationLink: string;
    salt: string;
    iv: string;
}

export interface Login {
    login: boolean;
    token: string | null;
    user: string | null;
}