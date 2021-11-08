uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uTime;
uniform vec3 uCameraPos;

attribute vec3 aPosition;
attribute vec2 uv;

varying vec3 vPos;
varying vec2 vUv;
varying float vFogDist;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  vec4 pos = modelMatrix * vec4(aPosition, 1.0);

  vPos = pos.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * pos;
  vFogDist = distance(pos.xyz, uCameraPos.xyz);
}