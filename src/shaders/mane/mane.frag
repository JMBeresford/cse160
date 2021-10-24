precision mediump float;

uniform vec2 uResolution;
//uniform float uTime;
uniform vec3 uColor;

varying float fade;

void main() {
  float d = min(distance(gl_PointCoord, vec2(0.5)) * 2.0, 1.0);
  
  float strength = 1.0 - d;
  strength = pow(strength, 5.0);

  float opacity = smoothstep(0.2, 0.9, strength);

  vec3 color = uColor * opacity;

  gl_FragColor = vec4(color, opacity * fade);
}