uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uNoiseTex;
uniform sampler2D uDistortionTex;

varying vec3 vPos;

#define S smoothstep
#define FOCUS vec2(0.5, 0.25)
#define BLUR 0.05
#define DISTORT_STR 0.8

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: cnoise2 = require(glsl-noise/classic/2d)


/*
author: Patricio Gonzalez Vivo
description: Fractal Brownian Motion
use: fbm(<vec2> pos)
options:
    FBM_OCTAVES: numbers of octaves. Default is 4.
    FBM_NOISE_FNC(POS_UV): noise function to use Default 'snoise(POS_UV)' (simplex noise)
    FBM_VALUE_INITIAL: initial value. Default is 0.
    FBM_SCALE_SCALAR: scalar. Defualt is 2.
    FBM_AMPLITUD_INITIAL: initial amplitud value. Default is 0.5
    FBM_AMPLITUD_SCALAR: amplitud scalar. Default is 0.5
license: |
    Copyright (c) 2021 Patricio Gonzalez Vivo.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.    
*/

#ifndef FBM_OCTAVES
#define FBM_OCTAVES 6
#endif

#ifndef FBM_VALUE_INITIAL
#define FBM_VALUE_INITIAL 0.0
#endif

#ifndef FBM_SCALE_SCALAR
#define FBM_SCALE_SCALAR 2.0
#endif

#ifndef FBM_AMPLITUD_INITIAL
#define FBM_AMPLITUD_INITIAL 0.5
#endif

#ifndef FBM_AMPLITUD_SCALAR
#define FBM_AMPLITUD_SCALAR 0.5
#endif

#ifndef FNC_FBM
#define FNC_FBM

float fbm(in vec3 pos) {
    // Initial values
    float value = FBM_VALUE_INITIAL;
    float amplitud = FBM_AMPLITUD_INITIAL;

    // Loop of octaves
    for (int i = 0; i < FBM_OCTAVES; i++) {
        value += amplitud * snoise3(pos);
        pos *= FBM_SCALE_SCALAR;
        amplitud *= FBM_AMPLITUD_SCALAR;
    }
    return value;
}
#endif

void main() {
  vec2 uv = gl_PointCoord;
  uv.y = 1.0 - uv.y;

  float distFromFocus = clamp(distance(uv, FOCUS) * 4.0, 0.0, 1.0);

  float str = S(0.8, 0.3, distFromFocus);
  float innerStr = S(0.7, 0.1, distFromFocus);

  float x = abs(uv.x -0.5);
  float center = S(-BLUR, BLUR, uv.y - FOCUS.y) * S(BLUR, -BLUR, x - 0.12);
  center = clamp(center + str, 0.0, 1.0);

  float grad = S(0.65, 0.15, uv.y) * 2.0 - 1.0;

  vec2 distortion = vec2(fbm(vec3(uv * 3.0, fract(uv.y))), -fbm(vec3(uv * 4.0, fract(uv.x))));

  uv += distortion;
  uv.y -= uTime * 0.5;

  // uv += vec2(0.5, 0.4);

  float noise = S(0.0, 0.4, fbm(vec3(uv, 1.0))) + grad;

  float flames = center * noise + S(0.0,0.5, str);

  float opacity = flames;

  vec3 color = vec3(1.0);
  color = mix(color, uColor, flames);
  color = mix(color, vec3(1.0), innerStr);

  // if (grad >= 1.0) {
  //   color = vec3(1.0, 0.0, 0.0);
  // }

  // if (str > 0.0) {
  //   color = vec3(1.0, 1.0, 0.0);
  // }

  gl_FragColor = vec4(color, flames);
}