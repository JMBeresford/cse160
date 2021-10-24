precision mediump float;

uniform vec2 uResolution;

uniform vec3 uColor;
uniform float uBrightness;

void main() {
  gl_FragColor = vec4(uColor * uBrightness, 1.0);
}