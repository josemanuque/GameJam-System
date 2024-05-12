export interface JamRequestI {
    title: string,
    description: string,
    startingDate: string,
    endingDate: string,
    theme: string,
    stages: string[]
}

export interface JamResponseI {
    _id: string,
    title: string,
    description: string,
    startingDate: string,
    endingDate: string,
    theme: string,
    stages: string[]
}

export interface JamListResponseI {
    jams: JamResponseI[]
}

export interface JamSiteAssignRequestI {
    jamID: string,
    siteID: string
}


export interface JamMessageResponseI {
    message: string
}
