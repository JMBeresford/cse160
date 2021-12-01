uniform float uTime;
uniform float uPixelRatio;
uniform float uSpriteSize;

varying vec3 vPos;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {
  vec3 pos = position;

  pos.x += snoise2(vec2(pos.x, uTime * 0.08));
  pos.y += snoise2(vec2(pos.y, uTime * 0.02)) * 3.0;
  pos.z += snoise2(vec2(pos.z, uTime * 0.03));

  vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSpriteSize * uPixelRatio * (uSpriteSize / -viewPosition.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vPos = (modelMatrix * vec4(position, 1.0)).xyz;
}