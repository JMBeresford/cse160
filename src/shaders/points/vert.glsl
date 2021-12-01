uniform float uTime;
uniform float uPixelRatio;

varying vec3 vPos;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {
  vec3 pos = position;
  float rand = abs(pos.x * pos.z);

  float elevation = log(mod((uTime * 0.1) + rand, 3.0) + 1.0) * 3.0;
  pos.y = elevation;
  pos.x += snoise2(vec2(elevation * 0.5, rand)) * 0.5;
  pos.z += snoise2(vec2(elevation * 0.5, rand)) * 0.5;

  vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 20.0 * uPixelRatio * (20.0 / -viewPosition.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vPos = pos;
}