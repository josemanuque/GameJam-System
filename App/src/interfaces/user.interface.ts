import { RoleResponseI } from "./role.interface"

export interface UserResponseI {
    _id: string,
    name: string,
    lastname: string,
    username: string,
    email: string,
    phone: string,
    site: string,
    region: string,
    roles: RoleResponseI[]
}

export interface UserFindResponseI {
    username: string,
    email: string,
    roles: RoleResponseI[]
}

export interface UserPasswordChangeI {
    username: string,
    currentPassword: string,
    newPassword: string
}