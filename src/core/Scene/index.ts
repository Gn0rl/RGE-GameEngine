import { GameObject } from "../GameObject"

export class Scene {
    objects: Array<GameObject>
    
    constructor() {
        this.objects = [];
    }

    addObject(object: GameObject | Array<GameObject>) {
        if(Array.isArray(object)){
            object.forEach((obj) => {
                this.objects.push(obj);
            })

            return this
        }

        this.objects.push(object)

        return this
    }
}