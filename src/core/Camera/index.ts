import { Scene } from "@core/Scene";
import { GameObject } from "@core/GameObject";

export class Camera extends GameObject {
    scene: Scene;
    
    constructor(name: string, scene: Scene, posX = 0, posY = 0) {
        super(name, posX, posY)
        this.scene = scene
    }

    getRenderItems() {
    return this.scene.objects.map(object => ({
        ...object,
        posX: object.posX - this.posX, // Без модификации оригинала
        posY: object.posY - this.posY
    }));
    }
}