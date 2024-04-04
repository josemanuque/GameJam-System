export interface UserResponseI {
    _id: string,
    name: string,
    lastname: string,
    username: string,
    email: string,
    phone: string,
    site: string,
    region: string,
    roles: string[]
}

export interface UserFindResponseI {
    username: string,
    email: string,
    roles: string[]
}