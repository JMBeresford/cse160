precision mediump float;

uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uTime;
uniform float uBrightness;

varying vec3 vCoord;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)

void main() {
  vec2 st = vCoord.xy / uResolution;

  vec3 color1 = vec3(0.1647, 0.2353, 0.4078);
  vec3 color2 = vec3(0.749, 0.8196, 1.0);

  float strength = clamp(snoise4(vec4(vCoord.xzy * 2.0, uTime)), 0.0, 1.0);
  float ring = smoothstep(0.3, 1.0, strength) - smoothstep(0.7, 1.0, strength);

  vec3 color = ring * color1 + (1.0 - ring) * uColor;

  color *= uBrightness;

  gl_FragColor = vec4(color, 1.0);
}