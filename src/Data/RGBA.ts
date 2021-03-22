import { black, white } from "../util/color/const"

export interface RGBA {

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
    
}

export const WHITE: RGBA = { ...white}
Object.freeze(WHITE)

export const BLACK: RGBA = { ...black }
Object.freeze(BLACK)