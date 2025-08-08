import { Scene } from "../Scene";
import { GameObject } from "../GameObject";

export class Camera extends GameObject {
    public scene: Scene;
    
    constructor(name: string, scene: Scene, posX = 0, posY = 0) {
        super(name, posX, posY)
        this.scene = scene
    }
}