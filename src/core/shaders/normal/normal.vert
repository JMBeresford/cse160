uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 uRotation;

attribute vec3 aPosition;
attribute vec3 aColor;
attribute vec3 normal;

varying vec3 vNormal;

#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: inverse = require(glsl-inverse)

void main() {
  vNormal = transpose(inverse(mat3(modelMatrix))) * normal;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}