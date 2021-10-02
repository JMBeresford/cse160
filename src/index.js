import './style.css';
import { init } from './utils';

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

// init webGL context
const gl = init();

example(gl);
