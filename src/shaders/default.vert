attribute vec4 aPosition;

uniform mat4 uTranslationMatrix;
uniform mat4 uScaleMatrix;
uniform mat4 uRotationMatrix;

void main() {

  gl_Position = uTranslationMatrix * uScaleMatrix * uRotationMatrix * aPosition;
}