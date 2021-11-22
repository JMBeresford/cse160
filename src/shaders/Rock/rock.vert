uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
uniform vec3 uCameraPos;

attribute vec3 aPosition;
attribute vec2 uv;
attribute vec3 normal;

varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vUv;
varying float vFogDist;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: inverse = require(glsl-inverse)

void main() {
  vec4 pos = modelMatrix * vec4(aPosition, 1.0);

  vPos = pos.xyz;
  vNormal = transpose(inverse(mat3(modelMatrix))) * normal;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * pos;
  vFogDist = distance(pos.xyz, uCameraPos.xyz);
}