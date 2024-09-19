export interface HeroRes {
    id: number
    duplicates: number
    name: string
    description: string
    imageURL: string
    comics?: string[]
    events?: string[]
    series?: string[]
}