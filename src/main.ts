import { Scene, GameObject, Renderer, Camera, Input } from './core'

import image from '../image.png'
import pixel from '../pixelTest.png'
import { Component } from './core/Component'
import { Physical } from './components/Physical'

let input = new Input()

let playerSpeed = 1

class MovementComponent extends Component {
	playerPhysics: Physical
	constructor(playerPhysics: Physical) {
		super()

		this.playerPhysics = playerPhysics
	}

	update() {
		if (input.pressed['KeyD']) {
			this.playerPhysics.addForce({ x: playerSpeed, y: 0 })
		}
		if (input.pressed['KeyA']) {
			this.playerPhysics.addForce({ x: -playerSpeed, y: 0 })
		}
		if (input.pressed['KeyS']) {
			this.playerPhysics.addForce({ x: 0, y: -playerSpeed })
		}
		if (input.pressed['KeyW']) {
			this.playerPhysics.addForce({ x: 0, y: playerSpeed })
		}
	}
}

let player = new GameObject('player', 0, 0, { x: 200, y: 200 })

const playerPhysics = new Physical(player, 0, 0)
player.addComponent(playerPhysics)

const movement = new MovementComponent(playerPhysics)
player.addComponent(movement)

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
	new GameObject(
		`temple`,
		-2,
		0,
		{ x: globalThis.innerWidth, y: globalThis.innerHeight },
		'pixel'
	)
)

let then = 0

const fpsCounter = document.getElementById('fps')

async function Update(now: number) {
	now *= 0.001
	const deltaTime = now - then
	then = now
	const fps = 1 / deltaTime
	fpsCounter!.textContent = `fps: ${fps.toFixed(1)}`

	player.update()

	camera.posX = player.posX
	camera.posY = player.posY

	renderer.render()
	requestAnimationFrame(Update)
}

requestAnimationFrame(Update)
