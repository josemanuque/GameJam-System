export interface UserRegisterI {
    name: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    phone: string,
    site: string,
    region: string,
    roles: string[],
}

export interface UserLoginI {
    username: string,
    password: string,
}

export interface AuthResponseI {
    _id: string,
    name: string,
    lastname: string,
    username: string,
    email: string,
    phone: string,
    site: string,
    region: string,
    roles: string[],
    accessToken: string
}

export interface AuthForgotPasswordI {
    email: string
}

export interface AuthResetPasswordI {
    email: string,
    OTP: string,
    password: string
}