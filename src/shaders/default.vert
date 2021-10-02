attribute vec4 aPosition;

uniform mat4 uTranslationMatrix;
uniform mat4 uScaleMatrix;

void main() {
  gl_Position = uTranslationMatrix * uScaleMatrix * aPosition;
}