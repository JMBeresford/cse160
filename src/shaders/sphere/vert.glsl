uniform float uTime;

attribute vec2 aInstanceId; // [row, col]

varying vec3 vPos;
varying float vDist;

void main() {
  vec4 pos = modelMatrix * instanceMatrix * vec4(position, 1.0);

  vDist = distance(pos.xyz, vec3(0.0));

  float elevation = sin((uTime * 0.0025 + (aInstanceId.y + 1.0)) * 50.0);
  elevation *= cos((uTime * 0.001 + (aInstanceId.x + 1.0)) * 50.0);

  pos.y += elevation;

  gl_Position = projectionMatrix * viewMatrix * pos;

  vPos = vec4(instanceMatrix * vec4(position, 1.0)).xyz;
}