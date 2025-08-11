import { Camera } from '../Camera'
import fsSource from './shaders/frag.glsl'
import vsSource from './shaders/vert.glsl'
import type { GameObject } from '../GameObject'
import { loadTexture } from './loadTexture'

import noImage from '../../../noImage.png'
import type { Scene } from '../Scene'

export class Renderer {
	private app: WebGLRenderingContext

	private shaderProgram: WebGLProgram
	private vertexBuffer: WebGLBuffer
	private colorBuffer: WebGLBuffer
	private textureCoordBuffer: WebGLBuffer
	private textures: Record<string, WebGLTexture>

	public scene: Scene

	constructor(scene: Scene) {
		this.scene = scene

		const canvas = document.getElementById('view') as HTMLCanvasElement
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		const gl = canvas.getContext('webgl')

		if (!gl) {
			throw new Error('WebGL not supported in this browser')
		}

		this.app = gl

		gl.enable(gl.BLEND)
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

		const vertexShader = gl.createShader(gl.VERTEX_SHADER)
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

		if (vertexShader && fragmentShader) {
			gl.shaderSource(vertexShader, vsSource)
			gl.compileShader(vertexShader)

			gl.shaderSource(fragmentShader, fsSource)
			gl.compileShader(fragmentShader)
		} else {
			throw new Error("Shaders can't be created")
		}

		this.shaderProgram = gl.createProgram()
		gl.attachShader(this.shaderProgram, vertexShader)
		gl.attachShader(this.shaderProgram, fragmentShader)
		gl.linkProgram(this.shaderProgram)
		gl.useProgram(this.shaderProgram)

		this.vertexBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)

		this.colorBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)

		this.textureCoordBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer)

		this.textures = {
			nothing: loadTexture(this.app, noImage),
		}

		gl.clearColor(0.0, 0.0, 0.0, 1.0)

		this.render()
	}

	changeCamera(camera: Camera) {
		this.scene.camera = camera
		return this
	}

	async loadTextures(
		textures: Record<string, { src: string; pixel?: boolean }>
	) {
		const textureNames = Object.keys(textures)
		for (let i = 0; i < textureNames.length; i++) {
			const textureInfo = textures[textureNames[i]]
			this.textures[textureNames[i]] = loadTexture(
				this.app,
				textureInfo.src,
				textureInfo.pixel
			)
		}
	}

	async render() {
		const gl = this.app
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.useProgram(this.shaderProgram)

		const objects = this.scene.objects
		const batches: Record<string, GameObject[]> = {}

		objects.forEach((object) => {
			const textureKey = object.texture || 'nothing'
			if (!batches[textureKey]) batches[textureKey] = []
			batches[textureKey].push(object)
		})

		const matrix = new Float32Array([
			1 / globalThis.innerWidth,
			0,
			0,
			0,
			0,
			1 / globalThis.innerHeight,
			0,
			0,
			0,
			0,
			1,
			0,
			(-1 * this.scene.camera.posX) / globalThis.innerWidth,
			(-1 * this.scene.camera.posY) / globalThis.innerHeight,
			0,
			1,
		])
		const uMatrix = gl.getUniformLocation(this.shaderProgram, 'matrix')
		gl.uniformMatrix4fv(uMatrix, false, matrix)

		const position = gl.getAttribLocation(
			this.shaderProgram,
			'vertexPosition'
		)
		const texCoord = gl.getAttribLocation(
			this.shaderProgram,
			'textureCoord'
		)

		Object.keys(batches).forEach((textureKey) => {
			const vertices: number[] = []
			const textureCoords: number[] = []
			batches[textureKey].forEach((obj) => {
				vertices.push(
					obj.posX - obj.size.x,
					obj.posY + obj.size.y, // A
					obj.posX - obj.size.x,
					obj.posY - obj.size.y, // B
					obj.posX + obj.size.x,
					obj.posY - obj.size.y, // C

					obj.posX - obj.size.x,
					obj.posY + obj.size.y, // A
					obj.posX + obj.size.x,
					obj.posY - obj.size.y, // C
					obj.posX + obj.size.x,
					obj.posY + obj.size.y // D
				)
				if (obj.flipX) {
					textureCoords.push(
						1.0,
						0.0,
						1.0,
						1.0,
						0.0,
						1.0,

						1.0,
						0.0,
						0.0,
						1.0,
						0.0,
						0.0
					)
				} else {
					textureCoords.push(
						0.0,
						0.0,
						0.0,
						1.0,
						1.0,
						1.0,

						0.0,
						0.0,
						1.0,
						1.0,
						1.0,
						0.0
					)
				}
			})

			gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
			gl.enableVertexAttribArray(position)

			gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0)
			gl.enableVertexAttribArray(texCoord)

			// Вершины
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(vertices),
				gl.STATIC_DRAW
			)
			gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

			// Текстурные координаты
			gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer)
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(textureCoords),
				gl.STATIC_DRAW
			)
			gl.vertexAttribPointer(texCoord, 2, gl.FLOAT, false, 0, 0)

			gl.activeTexture(gl.TEXTURE0)
			gl.bindTexture(
				gl.TEXTURE_2D,
				this.textures[textureKey] || this.textures.nothing
			)
			const sampler = gl.getUniformLocation(this.shaderProgram, 'sampler')
			gl.uniform1i(sampler, 0)

			const vertexCount = vertices.length / 2
			gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
		})
	}
}
