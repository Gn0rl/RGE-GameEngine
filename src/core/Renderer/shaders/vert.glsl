attribute vec3 vertexPosition;
attribute vec4 vertexColor;

uniform mat4 matrix;

varying lowp vec4 vColor;

void main(void) {
    gl_Position = matrix * vec4(vertexPosition, 1.0);
    vColor = vertexColor;
}