precision mediump float;

uniform vec3 uColor;

void main() {
  float d = distance(gl_PointCoord, vec2(0.5)) * 2.0;
  float brightness = pow(clamp(1.0 - d, 0.0, 1.0), 2.0);

  vec3 color = uColor * brightness;

  gl_FragColor = vec4(color, brightness);
}