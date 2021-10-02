import './style.css';
import { Matrix4 } from '../lib/cuon-matrix-cse160';
import { init, clearCanvas } from './utils';

// create a point at origin and draw it
const example = (gl) => {
  const vertices = new Float32Array([0, 0, 0]);

  const vBuffer = gl.createBuffer();

  // assign attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const aPositionPtr = gl.getAttribLocation(gl.program, 'aPosition');
  gl.vertexAttribPointer(aPositionPtr, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPositionPtr);

  // draw the point
  gl.drawArrays(gl.POINTS, 0, 1);
};

const initVertices = (gl, shape) => {
  switch (shape) {
    case 'triangle': {
      const vertices = new Float32Array([
        // v0
        0, 0.5,
        // v1
        -0.5, -0.5,
        // v2
        0.5, -0.5,
      ]);

      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      const aPositionPtr = gl.getAttribLocation(gl.program, 'aPosition');
      gl.vertexAttribPointer(aPositionPtr, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPositionPtr);
    }

    case 'square': {
      const vertices = new Float32Array([
        // v0
        -0.5, 0.5,
        // v1
        -0.5, -0.5,
        // v2
        0.5, -0.5,
        // v3
        0.5, -0.5,
      ]);

      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
      const aPositionPtr = gl.getAttribLocation(gl.program, 'aPosition');
      gl.vertexAttribPointer(aPositionPtr, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPositionPtr);
    }
  }
};

const draw = (gl) => {
  let shape = document.getElementById('shape').value;
  let scale = document.getElementById('scale').value;

  let scaleMatrix = new Matrix4();

  scaleMatrix.setScale(scale, scale, 1);

  // assign uniforms
  const uScaleMatrixPtr = gl.getUniformLocation(gl.program, 'uScaleMatrix');
  gl.uniformMatrix4fv(uScaleMatrixPtr, false, scaleMatrix);

  switch (shape) {
    case 'triangle': {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    case 'square': {
      gl.drawArrays(gl.TRIANGLES_STRIP, 0, 4);
    }
  }
};

// init webGL context
const gl = init();

const vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

document.getElementById('clear').onclick = () => {
  clearCanvas(gl);
};
