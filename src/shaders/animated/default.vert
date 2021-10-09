attribute vec4 aPosition;

uniform mat4 uTranslationMatrix;
uniform mat4 uScaleMatrix;
uniform mat4 uRotationMatrix;
uniform float uOffset;

void main() {
  gl_Position = uTranslationMatrix * uRotationMatrix * uScaleMatrix * aPosition;
}