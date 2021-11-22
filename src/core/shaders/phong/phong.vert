uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 aPosition;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPosition;

#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: inverse = require(glsl-inverse)

void main() {
  vNormal = transpose(inverse(mat3(modelMatrix))) * normal;
  vPosition = vec4(modelMatrix * vec4(aPosition, 1.0)).xyz;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}