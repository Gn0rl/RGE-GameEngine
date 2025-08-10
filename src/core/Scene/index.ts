import type { Camera } from '../Camera'
import { GameObject } from '../GameObject'

export class Scene {
	public objects: Array<GameObject>
	public camera: GameObject

	constructor(camera: Camera) {
		this.camera = camera
		this.objects = []
	}

	addObject(object: GameObject | Array<GameObject>) {
		if (Array.isArray(object)) {
			object.forEach((obj) => {
				this.objects.push(obj)
			})

			return this
		}

		this.objects.push(object)

		return this
	}
}
