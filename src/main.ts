import { Scene } from "./core/Scene"
import { GameObject } from "./core/GameObject"
import { Renderer } from "./core/Renderer"
import { Camera } from "./core/Camera"
import { Input } from "./core/Input"

import image from "../image.png"

let scene = new Scene()

let input = new Input()
let player = new GameObject('player', 0, 0)
scene.addObject(player)

let camera = new Camera("camera", scene)

let renderer = new Renderer(camera)

renderer.loadTextures({'test': image})

for(let i = 0; i <= 10000; i++) {
    scene.addObject(new GameObject(`obj${i}`, Math.random()*2 - 1, Math.random()*2 - 1, 0.1, "test"))
}

let fps = 0

function Update() {
    fps++
    
    if(input.pressed["KeyD"]){
        player.posX += 0.01
    }
    if(input.pressed["KeyA"]){
        player.posX -= 0.01
    }
    if(input.pressed["KeyS"]){
        player.posY -= 0.01
    }
    if(input.pressed["KeyW"]){
        player.posY += 0.01
    }

    camera.posX = player.posX
    camera.posY = player.posY

    if(camera.posX > 2.2)
        camera.posX = -2

    renderer.render()
    requestAnimationFrame(Update)
}

setInterval(() => {
    console.log("fps:" + fps);
    fps = 0
}, 1000)

requestAnimationFrame(Update)