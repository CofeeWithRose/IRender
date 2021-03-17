
export class Vec2 {
    x: number
    y: number
    
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export const ZERO:Vec2 = Object.freeze({ x: 0, y: 0 })

export const ONE: Vec2 = Object.freeze({ x: 1, y: 1 })