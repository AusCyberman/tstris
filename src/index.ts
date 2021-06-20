import { GameObject } from "./GameObject"
import { V2 } from "./geo/Vector2"
import { Shape, ShapeType } from "./shapes/Shape"
type Color = {
    red: number,
    green: number,
    blue: number
}





class Game {
    id: string
    ctx: CanvasRenderingContext2D

    constructor(ctx: CanvasRenderingContext2D, id = "gameCanvas") {
        this.id = "gameCanvas"
        this.ctx = ctx
    }



}



document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const game = new Game(ctx)
    const shape = new Shape(ShapeType.J,V2(10,10))
    shape.draw(ctx)
})

