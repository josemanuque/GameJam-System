export interface GameRequestI {
    title: string,
    description: string,
    teamID: string,
    buildLink: number,
    youtubeLinkGameplay: string,
    youtubeLinkPitch: string,
    categories: string
}

export interface GameResponseI {
    _id: string,
    title: string,
    description: string,
    teamID: string,
    buildLink: number,
    youtubeLinkGameplay: string,
    youtubeLinkPitch: string,
    categories: string
}

export interface GameMessageResponseI {
    message: string
}