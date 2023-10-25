export interface Message {
    type: string,
    payload?: {
        [key: string]: any
    }
}
