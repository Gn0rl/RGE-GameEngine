attribute vec3 vertexPosition;
attribute vec2 textureCoord;

uniform mat4 matrix;

varying highp vec2 vTextureCoord;

void main(void) {
    gl_Position = matrix * vec4(vertexPosition, 1.0);
    vTextureCoord = textureCoord;
}