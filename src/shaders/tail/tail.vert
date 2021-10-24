uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;

attribute vec3 aPosition;
attribute float aOffset;

varying float fade;

#define PI 3.14159

void main() {
  vec3 pos = aPosition;

  pos.z = mod(aPosition.z * aOffset + uTime, 1.5);

  float radius = 15.0 * exp(-0.95 * pos.z) * sin(PI * 0.1 * pos.z);

  pos.x = cos(uTime * aOffset) * radius * 0.2;
  pos.y = sin(uTime * aOffset) * radius * 0.2 + pow(pos.z, 3.0);

  gl_PointSize = 35.0 * (2.0 - pos.y);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);

  fade = min(gl_PointSize - 2.0, 1.0);
}