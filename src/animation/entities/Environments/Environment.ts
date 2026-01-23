
export type Environment<T> = {
    id: string
    name: string
    startTime: number
    stepMs: number
    data: T[]
}