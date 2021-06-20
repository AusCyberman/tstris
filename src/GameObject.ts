import { todo } from './util'
export abstract class GameObject {
    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract area(): number;
}