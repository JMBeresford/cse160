uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 aPosition;

void main() {
  gl_PointSize = 40.0;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}