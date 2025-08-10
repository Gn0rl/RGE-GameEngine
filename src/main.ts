import { Scene, GameObject, Renderer, Camera, Input } from './core'

import image from '../image.png'
import pixel from '../pixelTest.png'
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
			this.player.posX += 0.02
		}
		if (input.pressed['KeyA']) {
			this.player.posX -= 0.02
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

let camera = new Camera('camera')
let scene = new Scene(camera).addObject(player)

let renderer = new Renderer(scene)

renderer.loadTextures({
	test: { src: image },
	pixel: { src: pixel, pixel: true },
})

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

scene.addObject(
	new GameObject(`temple`, -2, 0, { x: 16 / 16, y: 9 / 16 }, 'pixel')
)

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
