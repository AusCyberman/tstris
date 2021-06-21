import { GameObject } from "./GameObject"
import { Direction, V2, Vector2, VectorMap } from "./geo/Vector2"
import { BlockMap, random_shape, Shape, ShapeType, ShapeCoords } from "./shapes/Shape"




class Game {
    id: string
    entireCanvasBottomRHS: Vector2
    startingGame: Vector2
    gameBottomRHS: Vector2
    width: number
    height: number
    score: number
    ctx: CanvasRenderingContext2D
    held: Shape
    currentBlock: Shape
    upcoming: Shape[]
    canHold: boolean
    blockSize: number
    blockMap: BlockMap
    //  movementStack : ShapeCoords[]
    constructor(ctx: CanvasRenderingContext2D, gamePartBottomRHS: Vector2, entireCanvasBottomRHS: Vector2, startingGame = V2(0, 0,), blockSize = 10) {
        this.blockSize = blockSize
        this.canHold = true
        this.gameBottomRHS = gamePartBottomRHS
        this.startingGame = startingGame
        this.width = (gamePartBottomRHS.x - this.startingGame.x)
        this.height = (gamePartBottomRHS.y - this.startingGame.y)
        this.blockMap = Array.from({ length: this.height / blockSize }, () => Array<string>(this.width / blockSize).fill(null))
        this.entireCanvasBottomRHS = entireCanvasBottomRHS
        this.id = "gameCanvas"
        this.ctx = ctx
        this.score = 0
        let g = this
        this.upcoming = Array.from({ length: 4 }, () => g.makeRandomShape())


    }
    randomSpawnLocation() {
        let val = V2(Math.floor(Math.random() * ((this.gameBottomRHS.x - (4 * this.blockSize)) / this.blockSize)), 0)
        console.log("Val is", val, "Block size is: ", this.blockSize)
        return val
    }
    makeRandomShape(location: Vector2 = V2(0, 0)) {
        return new Shape(random_shape(), location, this.gameBottomRHS, this.blockSize)
    }
    checkScore() {
        this.blockMap.forEach((row, num) => {

            if (row.every(e => e != null)) {
                this.blockMap.splice(num, 1);
                this.score++
                this.blockMap.unshift(Array(this.width).fill(null));
            }
        })
    }

    drawGrid() {
        this.ctx.save()
        let ctx = this.ctx
        let s = this.blockSize
        let nX = Math.floor((this.width + (this.blockSize * 2)) / s) - 2
        let nY = Math.floor((this.height + (this.blockSize * 2)) / s) - 2
        let pX = this.width - nX * s
        let pY = this.height - nY * s

        let pL = Math.ceil(pX / 2) - 0.5
        let pT = Math.ceil(pY / 2) - 0.5
        let pR = this.width - nX * s - pL
        let pB = this.height - nY * s - pT
        ctx.strokeStyle = 'lightgrey'
        ctx.beginPath()
        for (var x = pL; x <= this.width - pR; x += s) {
            ctx.moveTo(x, pT)
            ctx.lineTo(x, this.height - pB)
        }
        for (var y = pT; y <= this.height - pB; y += s) {
            ctx.moveTo(pL, y)
            ctx.lineTo(this.width - pR, y)
        }
        ctx.stroke()
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
    drawScore() {
        this.ctx.save()
        let textX = this.width + (2 * this.blockSize)
        let textY = 10
        this.ctx.beginPath()
        this.ctx.font = "50px "
        this.ctx.fillStyle = "blue"
        this.ctx.fillText("Score: " + this.score, textX, textY, 80)
        this.ctx.restore()
    }

    drawUpcomingAndHeld() {
        let offsetX = this.width + (2 * this.blockSize)
        let offsetY = 60
        let ctx = this.ctx
        ctx.beginPath()
        ctx.fillStyle = "Black"
        ctx.fillText("Held ", offsetX, offsetY, 90)
        if (this.held != null) {
            this.held.location = V2(offsetX / this.blockSize, offsetY / this.blockSize + 1)
            this.held.draw(this.ctx)
        }
        ctx.fillText("Upcoming ", offsetX, offsetY + 10 + 6 * this.blockSize)
        this.upcoming.forEach((v, i) => {
            v.location = V2(offsetX / this.blockSize, offsetY / this.blockSize + 7 + 5 * i)
            v.draw(ctx)
        })
    }
    drawShadow() {

        if (this.currentBlock != null) {
            var b = Object.assign(Object.create(Object.getPrototypeOf(this.currentBlock)), this.currentBlock);
            while (b.stopped != true) {
                b.move(Direction.Down, this.blockMap)
            }
            b.color = "grey"
            b.draw(this.ctx)
        }
    }
    draw() {
        this.ctx.clearRect(this.startingGame.x, this.startingGame.y, this.width + 2, this.height + 2)
        this.ctx.beginPath()
        this.ctx.clearRect(this.width + 20, 0, 10 * this.blockSize, this.blockSize * 80)
        this.ctx.beginPath()
        this.drawScore()
        this.drawUpcomingAndHeld()
        this.drawShadow()
        this.drawGrid()
        if (this.currentBlock != null) {
            this.currentBlock.draw(this.ctx)
        }
        this.blockMap.forEach((v, y) => {
            v.forEach((c, x) => {
                if (c != null) {
                    this.ctx.save()
                    this.ctx.beginPath()
                    this.ctx.fillStyle = c
                    this.ctx.strokeStyle = "black"
                    this.ctx.rect((x * this.blockSize) + this.startingGame.x, (y * this.blockSize) + this.startingGame.y, this.blockSize, this.blockSize)
                    this.ctx.stroke()
                    this.ctx.fill()
                    this.ctx.restore()
                }
            })
        })
    }




}

function tick(g: Game) {
    if (g.currentBlock == null) {
        g.canHold = true
        g.currentBlock = g.upcoming.shift()
        g.currentBlock.location = g.randomSpawnLocation()
        g.upcoming.push(g.makeRandomShape())
    }

    if (g.currentBlock.stopped) {
        for (const a of g.currentBlock.construct_coords()) {
            console.log(g.blockMap)
            console.log(a.y, a.x)
            if (a.y <= 0) {
                g.ctx.fillStyle = "red"
                g.ctx.font = "30px Bold"
                g.ctx.fillText("GAME OVER", (g.startingGame.x + g.width) / 2 - 60, g.startingGame.y + (g.height / 2 - 40))
                return
            }
            g.blockMap[a.y][a.x] = g.currentBlock.color
        }
        g.checkScore()
        g.currentBlock = null
    }
    g.draw()
    window.requestAnimationFrame(() => tick(g))
}


document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    const game = new Game(ctx, V2(280, 600), V2(800, 800), V2(0, 0), 20)
    window.setInterval(() => {
        if(game.currentBlock != null) {
            game.currentBlock.move(Direction.Down, game.blockMap)
        }
    },1000)
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
            case " ":
                while (game.currentBlock.stopped != true) {
                    game.move(Direction.Down)
                }
                break
            case "c":
                if (game.canHold) {
                    if (game.held == null) {
                        game.held = game.upcoming.pop()
                        game.upcoming.push(game.makeRandomShape())
                    }
                    [game.held, game.currentBlock] = [game.currentBlock, game.held]
                    game.currentBlock.location = game.randomSpawnLocation()
                    game.canHold = false
                }
            default:
                break
        }
    })

    window.requestAnimationFrame(() => tick(game))
})




