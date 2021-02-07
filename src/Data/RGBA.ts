import { type } from "os"

export interface RGBA {
    r: number
    g: number
    b: number
    a: number
}

export const WHITE: RGBA = Object.freeze({ r: 255, g: 255, b: 255, a:1}) 

export const BLACK: RGBA = Object.freeze({ r: 0, g:0, b:0, a: 1 })