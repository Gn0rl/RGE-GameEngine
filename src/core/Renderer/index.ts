import { Camera } from "../Camera"
import fsSource from "./shaders/frag.glsl"
import vsSource from "./shaders/vert.glsl"
import type { GameObject } from "../GameObject"

export class Renderer {
    app: WebGLRenderingContext

    camera: Camera

    private shaderProgram: WebGLProgram
    private vertexBuffer: WebGLBuffer
    private colorBuffer: WebGLBuffer
    private resScale: number

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

        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        this.render()
    }

    init() {
        return this
    }

    changeCamera(camera: Camera) {
        this.camera = camera
        return this
    }

    render() {
        const gl = this.app
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(this.shaderProgram)
        
        const items = this.camera.scene.objects
        
        items.forEach((obj: GameObject) => {
            const vertices = new Float32Array([
                obj.posX - 0.01, obj.posY + 0.01,
                obj.posX - 0.01, obj.posY - 0.01,
                obj.posX + 0.01, obj.posY - 0.01,
                obj.posX + 0.01, obj.posY + 0.01
            ])

            const colors = new Float32Array([
                0.0,0.0,1.0,1.0,
                1.0,0.0,0.0,1.0,
                0.0,1.0,0.0,1.0,
                0.0,0.0,1.0,1.0,
            ])

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
            
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

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
            const color = gl.getAttribLocation(this.shaderProgram, 'vertexColor')
            gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(color)

            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        })
    }
}