attribute vec3 vertexPosition;

uniform mat4 matrix;

void main(void) {


    gl_Position = matrix * vec4(vertexPosition, 1.0);
}