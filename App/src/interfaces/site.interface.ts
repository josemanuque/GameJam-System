export interface SiteCreateRequestI {
    name: string,
    region: string,
    country: string,
    city: string,
    modality: string
}

export interface SiteResponseI {
    _id: string,
    name: string,
    region: string,
    country: string,
    city: string,
    modality: string
}

// Works for getSites(From Region/Country)*
export interface SiteListResponseI {
    sites: SiteResponseI[]
}

// Remove site uses this response
export interface SiteMessageResponseI {
    message: string
}