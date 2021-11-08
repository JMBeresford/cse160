uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 uCameraPos;

attribute vec3 aPosition;
attribute vec2 uv;

varying vec2 vUv;
varying vec3 vPos;

void main() {
  vec4 pos = modelMatrix * vec4(aPosition, 1.0);

  vPos = pos.xyz - uCameraPos;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * pos;
}