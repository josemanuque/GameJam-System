export interface RoleCreateRequestI {
    name: string,
    description: string
}

export interface RoleResponseI {
    _id: string,
    name: string,
    description: string
}

export interface RoleAssignRequestI {
    username: string,
    role: string
}

export interface RoleListResponseI{
    roles: RoleResponseI[]
} 

export interface RoleMessageResponseI {
    message: string
}