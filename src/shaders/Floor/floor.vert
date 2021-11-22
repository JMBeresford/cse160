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
varying float height;
varying float vFogDist;

#pragma glslify: transpose = require(glsl-transpose)
#pragma glslify: inverse = require(glsl-inverse)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {

  vec4 pos = modelMatrix * vec4(aPosition, 1.0);
  float strength = clamp(cnoise3(pos.xyz * 0.1), 0.0, 1.0);
  height = smoothstep(0.0, 1.0, strength);
  pos.y += height * 0.2;

  vPos = pos.xyz;
  vNormal = transpose(inverse(mat3(modelMatrix))) * normal;

  gl_Position = projectionMatrix * viewMatrix * pos;
  vFogDist = distance(pos.xyz, uCameraPos.xyz);
}