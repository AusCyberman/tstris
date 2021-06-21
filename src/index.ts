import { GameObject } from "./GameObject"
import { Direction, V2, Vector2 } from "./geo/Vector2"
import { BlockMap, random_shape, Shape, ShapeType , ShapeCoords} from "./shapes/Shape"




class Game {
    id: string
    entireCanvasBottomRHS: Vector2
    gamePartBottomRHS: Vector2
    ctx: CanvasRenderingContext2D
    placedBlocks: Shape[]
    currentBlock: Shape
    blockMap: BlockMap
  //  movementStack : ShapeCoords[]
    constructor(ctx: CanvasRenderingContext2D, gamePartBottomRHS: Vector2, entireCanvasBottomRHS: Vector2, id = "gameCanvas") {
        this.placedBlocks = []
        this.blockMap = new Map()
        this.gamePartBottomRHS = gamePartBottomRHS
        this.entireCanvasBottomRHS = entireCanvasBottomRHS
        this.id = "gameCanvas"
        this.ctx = ctx
    }

    drawGrid() {
        this.ctx.save()
        this.ctx.strokeStyle = "black"
        this.ctx.fillStyle = "white"
        for (let i = 0; i < this.gamePartBottomRHS.x; i++) {
            for (let n = 0; n < this.gamePartBottomRHS.y; n++) {
                this.ctx.rect(i, n, 10, 10)
                this.ctx.stroke()
            }
        }
        this.ctx.restore()
    }
    move(direction: Direction) {
        if (this.currentBlock != null) {
            this.currentBlock.move(direction, this.blockMap)
        }
    }
    rotate() {
        if (this.currentBlock.rotation < 3)
            this.currentBlock.rotate(this.currentBlock.rotation + 1, this.blockMap)
        else
            this.currentBlock.rotate(0, this.blockMap)
    }

    draw() {
        this.ctx.clearRect(0, 0, this.gamePartBottomRHS.x, this.gamePartBottomRHS.y)
        this.ctx.beginPath()
        // this.drawGrid()
        if (this.currentBlock != null) {
            this.currentBlock.draw(this.ctx)
        }
        for (const a of this.placedBlocks) {
            this.ctx.save()
            a.draw(this.ctx)
            this.ctx.restore()
        }
    }




}

function tick(g: Game) {
    g.currentBlock.move(Direction.Down, g.blockMap)
    if (g.currentBlock == null) {
        g.currentBlock = new Shape(random_shape(), V2(Math.floor(Math.random() * (g.gamePartBottomRHS.x / 10)) * 10, 0), g.gamePartBottomRHS)
    }
    console.log(g.blockMap.size)
    g.currentBlock.move(Direction.Down, g.blockMap)
    if (g.currentBlock.stopped) {
        let placedBlockNum = g.placedBlocks.push(g.currentBlock) - 1
        for (const a of g.currentBlock.construct_coords()) {
            g.blockMap.set(a.string(), placedBlockNum)
        }
        g.currentBlock = null
    }
    g.draw()
    window.requestAnimationFrame(() => setTimeout(() => {
        tick(g)
    }, 100))
}


document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const game = new Game(ctx, V2(500, 500), V2(1000, 1000))
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowRight":
                game.move(Direction.Right)
                break
            case "ArrowLeft":
                game.move(Direction.Left)
                break
            case "ArrowDown":
                game.move(Direction.Down)
                break
            case "ArrowUp":
                game.rotate()
                break
            default:
                break
        }
        console.log(event.code)
    })

    window.requestAnimationFrame(() => tick(game))
})




