import { Scene } from "@core/Scene";
import { GameObject } from "@core/GameObject";
import { Renderer } from "@core/Renderer";
import { Camera } from "@core/Camera";

let scene = new Scene()
        // .addObject(new GameObject("World").log("Hello"))
        // .addObject(new GameObject('Hi', 0.3, 0.3))

for(let i = 0; i <= 10; i++) {
    scene.addObject(new GameObject(`obj${i}`, Math.random()*2 - 1, Math.random()*2 - 1))
}

let camera = new Camera("camera", scene)

let renderer = new Renderer(camera)

let fps = 0;

function Update() {
    fps++   
    
    // camera.posX += 1;

    if(camera.posX > 2.2)
        camera.posX = -2

    renderer.render()
    requestAnimationFrame(Update)
}

// setInterval(Update, 0)

setInterval(() => {
    console.log("fps:" + fps);
    fps = 0
}, 1000)

requestAnimationFrame(Update)