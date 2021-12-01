uniform float uTime;
uniform vec3 uLightColor;
uniform vec3 uHighlightColor;

varying vec3 vPos;

#define S smoothstep

void main() {
  float d = 0.5 - distance(gl_PointCoord, vec2(0.5));
  float intensity = S(0.0, 0.6, d);
  float fade = S(0.0, 0.95, log(4.0) * 3.0 - vPos.y);

  vec3 color = mix(uLightColor, uHighlightColor, fade * 0.75) * intensity;

  gl_FragColor = vec4(color, intensity * fade);
}