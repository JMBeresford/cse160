precision mediump float;

uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(1.0, vUv.x, vUv.y, 1.0);
}