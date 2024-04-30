import { TeamResponseI } from "./team.interface";

export interface NotificationIResponse {
    _id: string,
    username: string,
    team: TeamResponseI,
    message: string,
    type: string
}
