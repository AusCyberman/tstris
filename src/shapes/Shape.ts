import { GameObject } from '../GameObject'
import { V2, Vector2, Direction, VectorMap } from '../geo/Vector2'

export enum ShapeType {
    I = 0,
    J,
    L,
    O,
    S,
    T,
    Z,
}

export type ValidMove = "valid" | "stop" | "block"

export type BlockMap = string[][]

export type ShapeCoords = [Vector2, Vector2, Vector2, Vector2]

type ShapeData = {
    rotate: (d: Direction) => ShapeCoords
    color: string
}

export function random_shape(): ShapeType {
    return Math.floor(Math.random() * ShapeType.Z)
}

export function shape_factory(shape: ShapeType): ShapeData {
    switch (shape) {
        case ShapeType.I:
            return {
                rotate(direction: Direction): ShapeCoords {
                    switch (direction) {
                        case Direction.Up:
                        case Direction.Down:
                            return [V2(2, 0), V2(2, 1), V2(2, 2), V2(2, 3)]
                        case Direction.Right:
                        case Direction.Left:
                            return [V2(0, 1), V2(1, 1), V2(2, 1), V2(3, 1)]
                    }
                },
                color: "cyan"
            }
        case ShapeType.J:
            return {
                rotate(direction: Direction): ShapeCoords {
                    switch (direction) {
                        case Direction.Down:
                            return [V2(0, 1), V2(0, 2), V2(1, 2), V2(2, 2)]
                        case Direction.Up:
                            return [V2(0, 1), V2(1, 1), V2(2, 1), V2(2, 2)]
                        case Direction.Left:
                            return [V2(1, 0), V2(2, 0), V2(1, 1), V2(1, 2)]
                        case Direction.Right:
                            return [V2(1, 0), V2(1, 1), V2(0, 2), V2(1, 2)]

                    }
                },
                color: "darkblue"
            }
        case ShapeType.L:
            return {
                rotate(direction: Direction): ShapeCoords {
                    switch (direction) {
                        case Direction.Down:
                            return [V2(2, 1), V2(0, 2), V2(1, 2), V2(2, 2)]
                        case Direction.Up:
                            return [V2(0, 1), V2(1, 1), V2(2, 1), V2(0, 2)]
                        case Direction.Left:
                            return [V2(1, 0), V2(2, 2), V2(1, 1), V2(1, 2)]
                        case Direction.Right:
                            return [V2(1, 0), V2(1, 1), V2(0, 0), V2(1, 2)]

                    }
                },
                color: "orange"
            }
        case ShapeType.O:
            return {
                rotate(direction: Direction): ShapeCoords {
                    return [V2(0, 0), V2(0, 1), V2(1, 0), V2(1, 1)]
                },
                color: "yellow"
            }
        case ShapeType.S:
            return {
                rotate(direction: Direction) {
                    switch (direction) {
                        case Direction.Up:
                        case Direction.Down:
                            return [V2(1, 1), V2(2, 1), V2(0, 2), V2(1, 2)]
                        case Direction.Left:
                        case Direction.Right:
                            return [V2(0, 0), V2(0, 1), V2(1, 1), V2(1, 2)]
                    }

                },
                color: "green"
            }
        case ShapeType.T:
            return {
                rotate(direction: Direction) {
                    switch (direction) {
                        case Direction.Down:
                            return [V2(1, 1), V2(0, 2), V2(1, 2), V2(2, 2)]
                        case Direction.Left:
                            return [V2(1, 0), V2(1, 1), V2(2, 1), V2(1, 2)]
                        case Direction.Up:
                            return [V2(0, 1), V2(1, 1), V2(2, 1), V2(1, 2)]
                        case Direction.Right:
                            return [V2(1, 0), V2(0, 1), V2(1, 1), V2(1, 2)]
                    }
                },
                color: "purple"

            }

        case ShapeType.Z:
            return {
                rotate(direction: Direction) {
                    switch (direction) {
                        case Direction.Up:
                        case Direction.Down:
                            return [V2(0, 1), V2(1, 1), V2(1, 2), V2(2, 2)]
                        case Direction.Left:
                        case Direction.Right:
                            return [V2(2, 0), V2(1, 1), V2(2, 1), V2(1, 2)]
                    }


                    //                    return [V2(0, 0), V2(1, 0), V2(1, 1), V2(2, 1)]
                },
                color: "red"
            }
    }
}



export class Shape extends GameObject {
    area(): number {
        return 4
    }
    blockSize: number
    shape: ShapeType
    location: Vector2
    shape_vec: ShapeCoords
    stopped: boolean
    color: string
    rotation: Direction
    topLHS: Vector2
    bottomRHS: Vector2
    private rotateF: (direction: Direction) => ShapeCoords
    rotate(direction: Direction, blockMap: BlockMap) {
        if (!this.stopped) {


            if (blockMap != null) {
                let exist = false
                let new_coords = this.rotateF(direction)
                switch (this.validate(this.construct_coords(new_coords), blockMap)) {
                    case "valid":
                        this.shape_vec = new_coords
                        this.rotation = direction
                        break
                    case "stop":
                        this.stopped = true
                        break
                }
            } else {
                this.rotation = direction
                this.shape_vec = this.rotateF(direction)
            }
        }
    }
    validate(vec: Vector2[], blockMap: BlockMap): ValidMove {
        let exist = false
        for (const b of vec) {
            if (b.x >= ((this.topLHS.x + this.bottomRHS.x) / this.blockSize) || b.x < 0) {
                exist = true
            }
            if (((this.bottomRHS.y - this.topLHS.y) / this.blockSize) <= b.y) {
                return "stop"
            } else if (blockMap[b.y][b.x] != null) {
                exist = true
                if (this.construct_coords().some((e) => {
                    return e.y < b.y && e.x == b.x
                })) {
                    return "stop"
                }
            }

        }
        if (exist) {
            return "block"
        }
        return "valid"

    }
    construct_coords(vec: ShapeCoords = this.shape_vec, location: Vector2 = this.location): Vector2[] {
        return vec.map(e => {
            let a = V2(e.x, e.y)
            return a.add(location)
        })

    }

    move(direction: Direction, blockMap: BlockMap) {
        let new_loc = V2(this.location.x, this.location.y)
        if (!this.stopped) {
            switch (direction) {
                case Direction.Left:
                    new_loc.x -= 1
                    break
                case Direction.Right:
                    new_loc.x += 1
                    break
                case Direction.Down:
                    new_loc.y += 1
            }
            const status = this.validate(this.construct_coords(this.shape_vec, new_loc), blockMap)
            switch (status) {
                case "valid":
                    this.location = new_loc
                    return
                case "stop":
                    this.stopped = true
                    break
            }
        }
    }
    constructor(shape: ShapeType, location: Vector2, bottomRHS: Vector2, blockSize = 10, rotation = Direction.Down, topLHS: Vector2 = V2(0, 0)) {
        super()
        this.blockSize = blockSize
        this.location = location
        this.bottomRHS = bottomRHS
        this.topLHS = topLHS
        this.shape = shape
        const { rotate, color } = shape_factory(this.shape)
        this.rotateF = rotate
        this.rotate(rotation, null)
        this.color = color
        this.rotation = rotation
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save()
        ctx.fillStyle = this.color
        ctx.strokeStyle = "black"
        this.construct_coords().forEach(e => {
            let new_e = e.scale(this.blockSize).add(this.topLHS)
            ctx.beginPath()
            ctx.rect(new_e.x, new_e.y, this.blockSize, this.blockSize)
            ctx.fill()
            ctx.stroke()
        })
        ctx.restore()
    }
}
