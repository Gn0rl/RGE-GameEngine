export class Input {
    pressed: Record<string, boolean>

    constructor() {
        this.pressed = {}

        window.addEventListener('keypress', (e) => {
            this.pressed[e.code] = true
        })
        window.addEventListener('keyup', (e) => {
            delete this.pressed[e.code]
        })
    }
}