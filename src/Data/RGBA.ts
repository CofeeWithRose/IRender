import { black, white } from "../util/color/const"

export interface RGBA {
    r: number
    g: number
    b: number
    a: number
}

export const WHITE: RGBA = { ...white}
Object.freeze(WHITE)

export const BLACK: RGBA = { ...black }
Object.freeze(BLACK)