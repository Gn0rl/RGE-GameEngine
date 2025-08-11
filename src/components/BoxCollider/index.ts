import { Component, GameObject } from '@/core'

export class BoxCollider extends Component {
	public size: { x: number; y: number }

	constructor(object: GameObject) {
		super()

		this.size = object.size
	}
}
