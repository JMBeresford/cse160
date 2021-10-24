precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;

attribute vec3 aPosition;

void main() {
  vec3 pos = aPosition;

  gl_PointSize = 30.0 + sin(uTime * 3.0) * 15.0;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}