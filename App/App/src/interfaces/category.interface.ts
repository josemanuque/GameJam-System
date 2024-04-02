export interface CategoryCreateRequestI {
    name: string,
    description: string
}

export interface CategoryResponseI {
    _id: string,
    name: string,
    description: string
}

// Works for getCategoriesName
export interface CategoryListResponseI {
    categories: CategoryResponseI[]
}