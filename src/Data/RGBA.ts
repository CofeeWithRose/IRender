import { black, white } from "../util/color/const"

export class RGBA {

    /**
     * 0~255
     */
    r: number
    
    /**
     * 0~255
     */
    g: number
    
    /**
     * 0~255
     */
    b: number
    
    /**
     * 0~1
     */
    a: number
    
    constructor(r: number, g: number, b: number, a: number){
        this.r = r
        this.r = g
        this.b = b
        this.a = a
    }
}

export const WHITE: RGBA = { ...white}
Object.freeze(WHITE)

export const BLACK: RGBA = { ...black }
Object.freeze(BLACK)