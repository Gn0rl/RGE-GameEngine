export class GameObject {
    name: string
    posX: number
    posY: number

    constructor(name: string, posX = 0, posY = 0) {
        this.name = name
        this.posX = posX
        this.posY = posY
    }

    log(log) {
        console.log(this.name + " says: " + log)

        return this
    }
}