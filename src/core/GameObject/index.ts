import type { Component } from "../Component"

export class GameObject {
    name: string
    posX: number
    posY: number
    size: { 
        x: number
        y: number
    }
    texture?: string
    flipX: boolean
    components: Component[]

    constructor(name: string, posX = 0, posY = 0, size = { x: 0.1, y: 0.1 } , texture?: string) {
        this.name = name
        this.posX = posX
        this.posY = posY
        this.size = size
        this.texture = texture
        this.flipX = false
        this.components = []
    }

    log(log: any) {
        console.log(this.name + " says: " + log)

        return this
    }

    addComponent(component: Component) {
        this.components.push(component)
    }

    start() {
        for (const component of this.components) {
            component.start()
        }
    }

    update() {
        for (const component of this.components) {
            component.update()
        }
    }
}