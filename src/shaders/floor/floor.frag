precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

varying vec3 vCoord;

void main() {
  float d = length(vCoord.xz) / 25.0;
  float strength1 = smoothstep(0.3,0.45,pow(1.0 - d, 5.0 + cos(uTime * 10.0) * 0.3));
  float strength2 = smoothstep(0.3,0.6,pow(1.0 - d, 5.0 + sin(uTime * 10.0) * 0.3));

  vec3 color = vec3(strength2) + vec3(0.7373, 0.7843, 1.0) * strength1;

  gl_FragColor = vec4(color, strength1);
}