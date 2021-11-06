precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

#pragma glslify: cnoise4 = require(glsl-noise/classic/4d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#define S smoothstep

float rand2_1(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);

  return fract(p.x * p.y);
}

vec3 Star(vec2 uv, float rand, float time) {
  float d = length(uv);
  float size = 0.02 + pow(rand, 5.0) * 0.03 * sin(uTime * 0.01 * rand + 100.0);

  float star = pow(size / d, 2.0);

  vec3 col1 = vec3(1.0, 0.7765, 0.7765);
  vec3 col2 = vec3(0.6588, 0.902, 1.0);

  float col1Str = fract(rand * 21.4);
  return mix(col1, col2, col1Str) * star;
}

vec4 Stars(vec2 uv, float uTime) {
  vec4 Stars = vec4(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 offset = vec2(x,y);

        float n = rand2_1(id + offset);
        Stars += vec4(Star(gv - offset - vec2(n, fract(n * 69.0)) + 0.5, n, uTime), 1.0);
      }
    }

  return Stars;
}


void main() {
  vec4 finalColor = vec4(0.0588, 0.0314, 0.1059, 1.0);
  vec4 cloudColor = vec4(0.0588, 0.0353, 0.0941, 1.0);
  vec4 cloudColor2 =vec4(0.102, 0.0392, 0.098, 1.0);
  vec4 fogColor = vec4(0.7686, 0.7098, 0.8745, 1.0);

  vec3 pos = vPos * 0.05;
  vec2 uv = vUv * 200.0;

  float cloudStr = clamp(cnoise4(vec4(pos, uTime * 0.0005)), 0.0, 1.0);
  cloudStr += clamp(snoise4(vec4(pos * 0.5, uTime * 0.0005 + 10000.0)), 0.0, 1.0);
  float noise = clamp(cnoise4(vec4(pos, uTime * 0.0005)), 0.0, 1.0);
  noise += clamp(snoise4(vec4(pos * 0.5, uTime * 0.0005 + 10000.0)), 0.0, 1.0);
  

  finalColor += Stars(uv, uTime) * max(S(0.1, 0.6, noise), 0.1);
  finalColor += S(0.0, 0.7, cloudStr) * cloudColor;

  finalColor.rb += normalize(vPos.xy) * 0.05;

  gl_FragColor = finalColor;
}