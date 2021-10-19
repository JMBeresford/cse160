uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 aPosition;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  vColor = aColor;

  gl_Position = projectionMatrix * viewMatrix *modelMatrix * vec4(aPosition, 1.0);
}