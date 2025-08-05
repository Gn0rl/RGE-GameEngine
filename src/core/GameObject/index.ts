export class GameObject {
    name: string
    posX: number
    posY: number
    size: number
    texture?: string
    flipX: boolean

    constructor(name: string, posX = 0, posY = 0, size = 0.1, texture?: string) {
        this.name = name
        this.posX = posX
        this.posY = posY
        this.size = size
        this.texture = texture
        this.flipX = false
    }

    log(log: any) {
        console.log(this.name + " says: " + log)

        return this
    }
}