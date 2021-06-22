export function todo(ctx: string = ""): any {
    throw new Error("TODO" + (ctx ? ": " + ctx : ""))
}
export function clone<T>(obj : T): T {
            return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}