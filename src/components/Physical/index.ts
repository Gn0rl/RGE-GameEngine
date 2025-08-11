import { Component, GameObject } from '@/core'

export class Physical extends Component {
	public mass: number
	public gravityScale: number
	public object: GameObject

	private force: { x: number; y: number }

	constructor(object: GameObject, mass: number, gravityScale: number) {
		super()

		this.force = { x: 0, y: 0 }

		this.object = object
		this.gravityScale = gravityScale
		this.mass = mass
	}

	update() {
		this.force.y -= this.gravityScale

		this.object.posX += this.force.x
		this.object.posY += this.force.y
	}

	addForce(force: { x: number; y: number }) {
		this.force.x += force.x
		this.force.y += force.y
	}
}
