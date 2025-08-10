import { Scene, GameObject, Renderer, Camera, Input } from './core'

import image from '../image.png'
import { Component } from './core/Component'

let input = new Input()

class MovementComponent extends Component {
	player: GameObject
	constructor(player: GameObject) {
		super()

		this.player = player
	}

	update() {
		if (input.pressed['KeyD']) {
			this.player.posX += 0.01
		}
		if (input.pressed['KeyA']) {
			this.player.posX -= 0.01
		}
		if (input.pressed['KeyS']) {
			this.player.posY -= 0.01
		}
		if (input.pressed['KeyW']) {
			this.player.posY += 0.01
		}
	}
}

let player = new GameObject('player', 0, 0, { x: 0.1, y: 0.1 })

player.addComponent(new MovementComponent(player))

let scene = new Scene().addObject(player)

let camera = new Camera('camera', scene)

let renderer = new Renderer(camera)

renderer.loadTextures({ test: image })

for (let i = 0; i <= 1000; i++) {
	scene.addObject(
		new GameObject(
			`obj${i}`,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			{ x: 0.1, y: 0.1 },
			'test'
		)
	)
}

let fps = 0

async function Update() {
	player.update()

	camera.posX = player.posX
	camera.posY = player.posY

	renderer.render().then(() => {
		fps++
	})
	requestAnimationFrame(Update)
}

setInterval(() => {
	console.log('fps:' + fps)
	fps = 0
}, 1000)

requestAnimationFrame(Update)
