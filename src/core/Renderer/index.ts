import { Camera } from "../Camera"
import fsSource from "./shaders/frag.glsl"
import vsSource from "./shaders/vert.glsl"
import type { GameObject } from "../GameObject"
import { loadTexture } from "./loadTexture"

import noImage from "../../../noImage.png"

export class Renderer {
    app: WebGLRenderingContext

    camera: Camera

    private shaderProgram: WebGLProgram
    private vertexBuffer: WebGLBuffer
    private colorBuffer: WebGLBuffer
    private resScale: number
    private textureCoordBuffer: WebGLBuffer
    private textures: Record<string, WebGLTexture>

    constructor(camera: Camera) {
        this.camera = camera

        this.resScale = window.innerWidth / window.innerHeight

        const canvas = document.getElementById('view') as HTMLCanvasElement
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const gl = canvas.getContext('webgl')

        if (!gl) {
            throw new Error('WebGL not supported in this browser')
        }
        
        this.app = gl

        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        
        if(vertexShader && fragmentShader) {
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

        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

        this.textures = {
            nothing: loadTexture(this.app, noImage)
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        this.render()
    }

    changeCamera(camera: Camera) {
        this.camera = camera
        return this
    }

    async loadTextures(textures: Record<string, string>) {
        const textureNames = Object.keys(textures)
        for(let i = 0; i < textureNames.length; i++) {
            this.textures[textureNames[i]] = loadTexture(this.app, textures[textureNames[i]])
        }
    }

    render() {
        const gl = this.app
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(this.shaderProgram)
        
        const items = this.camera.scene.objects
        
        items.forEach((obj: GameObject) => {
            const vertices = new Float32Array([
                obj.posX - obj.size, obj.posY + obj.size,
                obj.posX - obj.size, obj.posY - obj.size,
                obj.posX + obj.size, obj.posY - obj.size,
                obj.posX + obj.size, obj.posY + obj.size,
            ])

            const matrix = new Float32Array([
                1,0,0,0,
                0,this.resScale,0,0,
                0,0,1,0,
                -this.camera.posX,-this.camera.posY*this.resScale,0,1
            ])

            const uMatrix = gl.getUniformLocation(this.shaderProgram, 'matrix')
            gl.uniformMatrix4fv(uMatrix,false, matrix)

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            const position = gl.getAttribLocation(this.shaderProgram, 'vertexPosition')
            gl.enableVertexAttribArray(position)
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

            const textureCoord = gl.getAttribLocation(this.shaderProgram, 'textureCoord')

            let texture = null
            if(obj.texture) {
                texture = this.textures[obj.texture]
            }
            if(!obj.texture) {
                texture = this.textures.nothing
            }

            const textureCoordinates = [
                1.0,  0.0,
                1.0,  1.0,
                0.0,  1.0,
                0.0,  0.0,
            ]
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

            gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(textureCoord)

            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, texture);

            const sampler = gl.getUniformLocation(this.shaderProgram, 'sampler')
            gl.uniform1i(sampler, 0);

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        })
    }
}