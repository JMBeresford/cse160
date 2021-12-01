uniform float uTime;

varying vec3 vPos;
varying vec2 vUv;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vPos = vec4(modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
}