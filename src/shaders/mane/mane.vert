uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;

attribute vec3 aPosition;
attribute float aOffset;

varying float fade;

void main() {
  vec3 pos = aPosition;
  
  float offset = mod(uTime * aOffset * 2.0, 1.2);

  pos.x = aPosition.x + offset;
  float diff = abs(aPosition.x - pos.x);
  pos.y = aPosition.y + pow(diff, 0.5) * 0.15 + abs(sin(pos.x * 5.0)) * 0.05;
  pos.z = aPosition.z / (clamp(diff, 0.2,1.0) * 10.0);

  gl_PointSize = 60.0 * (1.2 - pos.x);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);

  fade = clamp(gl_PointSize - 10.0 * aOffset - 2.0, 0.0, 1.0);
}