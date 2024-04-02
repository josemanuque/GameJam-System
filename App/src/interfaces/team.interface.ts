import { UserResponseI } from "./user.interface"

export interface TeamCreateRequestI {
    name: string,
    description: string,
    members: [string]
}

export interface TeamResponseI {
    _id: string,
    name: string,
    description: string,
    members: UserResponseI[],
    messages: [string]
}

export interface TeamAddKickRequestI {
    teamID: string,
    username: string
}

export interface TeamRenameRequestI {
    teamID: string,
    name: string
}

// Add/Kick/Rename requests have this response
export interface TeamMessageResponseI {
    message: string
}
