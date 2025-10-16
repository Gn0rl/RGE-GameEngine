import { Component, GameObject } from '@/core'

export class Physical extends Component {
	public object: GameObject
	public mass: number
	public gravityScale: number
	private _force: { x: number; y: number }

	constructor(object: GameObject, mass: number, gravityScale: number) {
		super()

		this._force = { x: 0, y: 0 }

		this.object = object
		this.gravityScale = gravityScale
		this.mass = mass
	}

	update() {
		this._force.y -= this.gravityScale

		this.object.posX += this._force.x
		this.object.posY += this._force.y
	}

	get force(): { x: number; y: number } {
		return this._force;
	}

	addForce(force: { x: number; y: number }) {
		this._force.x += force.x
		this._force.y += force.y
	}
}