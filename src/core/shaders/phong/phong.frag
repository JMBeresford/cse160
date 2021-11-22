precision mediump float;

uniform vec2 uResolution;
uniform vec3 uColor;
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
varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 spotLightTarget = normalize(uSpotLightTarget - uSpotLightPos);

  vec3 lightDir = normalize(uPointLightPos - vPosition);
  vec3 spotLightDir = -normalize(vPosition - uSpotLightPos);

  vec3 ambient = uAmbientColor * uAmbientIntensity;

  vec3 diffuse = clamp(uPointLightIntensity * uPointLightColor * dot(lightDir, normal), 0.0, 1.0);

  vec3 reflection = normalize(2.0 * dot(normal, lightDir) * normal - lightDir);
  vec3 viewDir = normalize(uCamPos - vPosition);
  float specularHighlight = pow(clamp(dot(reflection, viewDir), 0.0, 1.0), uSpecularExponent);
  vec3 specular = specularHighlight * uPointLightColor;

  float multiplier = pow(max(0.0, uSpotLightAngle - dot(spotLightTarget, spotLightDir)), 5.0);

  vec3 spotDiffuse = clamp(uSpotLightColor * uSpotLightIntensity * multiplier * dot(spotLightDir, normal), 0.0, 1.0);

  gl_FragColor = vec4((ambient + diffuse + specular + spotDiffuse) * uColor, 1.0);
}