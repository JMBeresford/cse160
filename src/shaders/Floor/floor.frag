precision mediump float;

uniform vec2 uResolution;

varying float height;
varying float vFogDist;
varying vec3 vPos;

#pragma glslify: cnoise3 = require(glsl-noise/simplex/3d)

#define FOG_START 5.0
#define FOG_END 20.0

void main() {
  // float fogFactor = pow(smoothstep(0.0, 1.0, vFogDist), 2.0);
  float fogFactor = clamp((FOG_END - vFogDist) / (FOG_END - FOG_START), 0.0, 1.0);

  vec4 finalColor = vec4(0.0, 0.0, 0.0, 1.0);
  vec3 col = vec3(0.702, 0.6902, 0.6667);
  vec3 col2 = vec3(0.9255, 0.9961, 1.0);
  vec3 darkSand = col - 0.2;
  vec3 fogColor = vec3(0.7686, 0.7098, 0.8745);

  float noise = clamp(cnoise3(vPos * 500.0), 0.0, 1.0);

  noise = smoothstep(0.5,1.0,noise);

  finalColor += vec4((1.0-noise)*(1.0-height)*col, 1.0);
  finalColor +=  vec4(height*darkSand, 1.0);
  finalColor += vec4(noise*col2, 1.0);

  finalColor = mix(finalColor, vec4(fogColor, 1.0), 1.0 - fogFactor);

  gl_FragColor = finalColor;
}