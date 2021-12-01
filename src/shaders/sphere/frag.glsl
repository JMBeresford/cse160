uniform float uTime;
uniform vec3 uLightColor;
uniform vec3 uDarkColor;
uniform vec3 uHighlightColor;
uniform vec3 uFogColor;

varying vec3 vPos;
varying float vDist;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

#define S smoothstep
#define FOG_START 20.0
#define FOG_END 30.0

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
#define FBM_OCTAVES 4
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

float fbm(vec4 pos) {
    // Initial values
    float value = FBM_VALUE_INITIAL;
    float amplitud = FBM_AMPLITUD_INITIAL;

    // Loop of octaves
    #pragma unroll_loop_start
    for (int i = 0; i < FBM_OCTAVES; i++) {
        value += amplitud * snoise4(pos);
        pos *= FBM_SCALE_SCALAR;
        amplitud *= FBM_AMPLITUD_SCALAR;
    }
    #pragma unroll_loop_end

    return value;
}

mat2 rot(float angle) {
  float s = sin(angle), c = cos(angle);

  return mat2(c,-s,s,c);
}

void main() {
  float fogFactor = clamp((FOG_END - vDist) / (FOG_END - FOG_START), 0.0, 1.0);

  vec3 color = uDarkColor;

  vec4 p = vec4(vPos, uTime * 0.1);

  float noise = S(0.15, 0.75, fbm(p));

  color = mix(color, uLightColor, noise);
  color = mix(color, uHighlightColor, S(0.55, 0.75, noise));

  color = mix(uFogColor, color, fogFactor);

  gl_FragColor = vec4(color, 1.0);
}