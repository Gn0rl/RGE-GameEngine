import { GameObject } from '../GameObject'

export class Camera extends GameObject {
	constructor(name: string, posX = 0, posY = 0) {
		super(name, posX, posY)
	}
}
