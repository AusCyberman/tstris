import { GameObject } from '../GameObject'
import { V2, Vector2, Direction } from '../geo/Vector2'
export enum ShapeType {
    I = 0,
    J,
    L,
    O,
    S,
    T,
    Z,
}

type ShapeCoords = [Vector2, Vector2, Vector2, Vector2]

type ShapeData = {
    rotate: (d: Direction) => ShapeCoords
    color: string
}

export function shape_factory(shape: ShapeType): ShapeData {
    switch (shape) {
        case ShapeType.I:
            return {
                rotate(direction: Direction): ShapeCoords {
                    switch (direction) {
                        case Direction.Up:
                        case Direction.Down:
                            return [V2(0, 0), V2(0, 1), V2(0, 2), V2(0, 3)]
                        case Direction.Right:
                        case Direction.Left:
                            return [V2(3, 0), V2(3, 1), V2(3, 2), V2(3, 3)]
                    }
                },
                color: "cyan"
            }
        case ShapeType.J:
            return {
                rotate(direction : Direction) : ShapeCoords {
                    switch (direction) {
                        case Direction.Down:
                            return [V2(0, 0), V2(1, 0), V2(1, 1), V2(1, 2)]
                    }
                },
                color: "darkblue"
            }
   //     case ShapeType.L:
   //         return [V2(2, 0), V2(0, 1), V2(1, 1), V2(2, 1)]
   //     case ShapeType.O:
   //         return [V2(0, 0), V2(0, 1), V2(1, 0), V2(1, 1)];
   //     case ShapeType.S:
   //         return [V2(1, 0), V2(2, 0), V2(0, 1), V2(1, 1)]
   //     case ShapeType.T:
   //         return [V2(1, 0), V2(0, 1), V2(1, 1), V2(2, 1)]
   //     case ShapeType.Z:
   //         return [V2(0, 0), V2(1, 0), V2(1, 1), V2(2, 1)]
    }
}



export class Shape extends GameObject {
    area(): number {
        return 4
    }
    shape: ShapeType
    location: Vector2
    shape_vec: ShapeCoords
    color : string
    rotation: Direction
    private rotateF: (direction: Direction) => ShapeCoords
    rotate(direction: Direction) {
        this.shape_vec = this.rotateF(direction)
    }

    constructor(shape: ShapeType, location: Vector2, rotation = Direction.Down) {
        super()
        this.location = location
        this.shape = shape
        const {rotate, color} = shape_factory(this.shape)
        this.rotateF = rotate
        this.rotate(rotation)
        this.color = color
        this.rotation = rotation
    }
    down() {
        this.location.x++
        this.location.y++

    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color
        ctx.strokeStyle = "black"
        this.shape_vec.map(e => {
            let a = V2(e.x * 10, e.y * 10)
            return a.add(this.location)
        }).forEach(e => {
            console.log(e)
            ctx.rect(e.x, e.y, 10, 10)
            ctx.fill()
            ctx.stroke()
        })
    }
}