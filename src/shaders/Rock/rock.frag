precision mediump float;

uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uAmbientIntensity;
uniform vec3 uAmbientColor;
uniform float uPointLightIntensity;
uniform vec3 uPointLightColor;
uniform vec3 uPointLightPos;
uniform float uSpecularExponent;

uniform float uSpotLightIntensity;
uniform vec3 uSpotLightColor;
uniform vec3 uSpotLightPos;
uniform float uSpotSpecularExponent;
uniform float uSpotLightAngle;
uniform vec3 uSpotLightTarget;

uniform vec3 uCamPos;

varying vec3 vNormal;
varying float vFogDist;
varying vec3 vPos;
varying vec2 vUv;

#define FOG_START 5.0
#define FOG_END 20.0

void main() {
  float fogFactor = clamp((FOG_END - vFogDist) / (FOG_END - FOG_START), 0.0, 1.0);

  vec3 fogColor = vec3(0.7686, 0.7098, 0.8745);

  vec4 texColor = texture2D(uTexture, vUv * 0.2);

  vec3 normal = normalize(vNormal);
  vec3 spotLightTarget = normalize(uSpotLightTarget - uSpotLightPos);

  vec3 lightDir = normalize(uPointLightPos - vPos);
  vec3 spotLightDir = -normalize(vPos - uSpotLightPos);

  vec3 ambient = uAmbientColor * uAmbientIntensity;

  vec3 diffuse = clamp(uPointLightIntensity * uPointLightColor * dot(lightDir, normal), 0.0, 1.0);

  vec3 reflection = normalize(2.0 * dot(normal, lightDir) * normal - lightDir);
  vec3 viewDir = normalize(uCamPos - vPos);
  float specularHighlight = pow(clamp(dot(reflection, viewDir), 0.0, 1.0), uSpecularExponent);
  vec3 specular = specularHighlight * uPointLightColor;

  float multiplier = pow(max(0.0, uSpotLightAngle - dot(spotLightTarget, spotLightDir)), 5.0);

  vec3 spotDiffuse = clamp(uSpotLightColor * uSpotLightIntensity * multiplier * dot(spotLightDir, normal), 0.0, 1.0);

  vec4 lighting = vec4(ambient + diffuse + specular + spotDiffuse, 1.0);

  vec4 color = texColor * lighting;

  gl_FragColor = mix(color, vec4(fogColor, 1.0), 1.0 - fogFactor);
}