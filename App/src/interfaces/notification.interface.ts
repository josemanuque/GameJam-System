import { TeamResponseI } from "./team.interface";

export interface NotificationResponseI {
    _id: string,
    username: string,
    team: TeamResponseI,
    message: string,
    type: string
}

export interface NotificationRequestI {
    username: string,
    team: string,
    message: string,
    type: string
}