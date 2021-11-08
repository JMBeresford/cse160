precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uBrightness;

varying float vFogDist;
varying vec3 vPos;
varying vec2 vUv;

#define FOG_START 5.0
#define FOG_END 20.0

void main() {
  float fogFactor = clamp((FOG_END - vFogDist) / (FOG_END - FOG_START), 0.0, 1.0);

  vec4 finalColor = vec4(0.302, 0.302, 0.302, 1.0);
  vec3 fogColor = vec3(0.7686, 0.7098, 0.8745);

  vec4 texColor = texture2D(uTexture, vUv * 0.2) * vec4(vec3(uBrightness), 1.0);

  finalColor = mix(texColor, vec4(fogColor, 1.0), 1.0 - fogFactor);

  gl_FragColor = finalColor;
}