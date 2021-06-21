export enum Direction {
    Down,
    Left,
    Up,
    Right
}
export class Vector2 {
    x: number
    y: number
    constructor(x : number, y : number) {
        this.x = x
        this.y = y
    }
    add(vec: Vector2): Vector2 {
        return new Vector2(vec.x + this.x, vec.y + this.y)
    }
    scale(factor : number) : Vector2 {
        return new Vector2(this.x*factor,this.y*factor)
    }
    string() {
        return `${this.x} ,  ${this.y}`
    }
}

export const V2: (x: number, y: number) => Vector2 = (x, y) => new Vector2(x, y)

