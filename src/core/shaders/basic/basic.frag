precision mediump float;

uniform vec2 uResolution;

uniform vec3 uColor;

void main() {
  gl_FragColor = vec4(uColor, 1.0);
}