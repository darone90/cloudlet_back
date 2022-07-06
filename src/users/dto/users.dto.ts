export class newUserDataSet {
    email: string;
    password: string;
    confirm: string;
    login: string
}

export class LoginData {
    login: string;
    password?: string;
}

export class PasswordResetData {
    password: string;
    confirm: string;
    code: string
}

export class UserChange {
    type: string;
    change: string;
    confirm: string;
    password: string;
}