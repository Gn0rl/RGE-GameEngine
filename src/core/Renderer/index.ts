import { Camera } from "@core/Camera"
import fsSource from "./shaders/frag.glsl"
import vsSource from "./shaders/vert.glsl"
import type { GameObject } from "../GameObject"

export class Renderer {
    app: WebGLRenderingContext

    camera: Camera

    private shaderProgram: WebGLProgram
    private vertexBuffer: WebGLBuffer

    constructor(camera: Camera) {
        this.camera = camera
        
        const canvas = document.getElementById('view') as HTMLCanvasElement
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const gl = canvas.getContext('webgl')
        
        if (!gl) {
            throw new Error('WebGL not supported in this browser')
        }
        
        this.app = gl

        // Initialize shaders
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

        // Create shader program
        this.shaderProgram = gl.createProgram()
        gl.attachShader(this.shaderProgram, vertexShader)
        gl.attachShader(this.shaderProgram, fragmentShader)
        gl.linkProgram(this.shaderProgram)
        gl.useProgram(this.shaderProgram)

        // Create vertex buffer
        this.vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)

        // Set clear color
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
            // Устанавливаем позицию квадрата
            const vertices = new Float32Array([
                obj.posX - 0.01, obj.posY + 0.01,
                obj.posX - 0.01, obj.posY - 0.01,
                obj.posX + 0.01, obj.posY - 0.01,
                obj.posX + 0.01, obj.posY + 0.01
            ])
            
            // Обновляем буфер вершин
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
            
            const matrix = new Float32Array([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                this.camera.posX,this.camera.posY,0,1
            ])

            const uMatrix = gl.getUniformLocation(this.shaderProgram, 'matrix')
            gl.uniformMatrix4fv(uMatrix,false, matrix)

            // Устанавливаем атрибут позиции
            const position = gl.getAttribLocation(this.shaderProgram, 'vertexPosition')
            gl.enableVertexAttribArray(position)
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

            // Рисуем квадрат
            gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        })
    }
}
