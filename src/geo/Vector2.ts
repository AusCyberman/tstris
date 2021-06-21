export enum Direction {
    Down,
    Left,
    Up,
    Right
}




export class VectorMap<T>  extends Map<Vector2,T>{
    has(e : Vector2) {
        var exist = false
       this.forEach((_,k) => {
            if(k.x  == e.x && e.y == k.y)
                exist = true
       }) 
        return exist

    }
    deleteKeys(vs : Vector2[]) {
        this.forEach((_,k) => {
            if(vs.some(e => k.x == e.x && k.y == e.y)) {
                this.delete(k)
            }
        })
    }

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
    
    toTuple()  : [number, number]{
        return [this.x,this.y]
    }
}

export const V2: (x: number, y: number) => Vector2 = (x, y) => new Vector2(x, y)

