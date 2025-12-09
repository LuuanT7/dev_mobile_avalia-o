export interface IClassRoom {
    id: string
    name: string
    ageRange: string
    description: string
}
export type CreateClass = {
    name: string
    ageRange: string
    description: string
}