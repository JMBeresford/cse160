import './style.css';
import { init, clearCanvas } from './utils';
import { Vector3 } from '../lib/cuon-matrix-cse160';

// draw vector v
const drawLine = (gl, v, colorRGB) => {
  let [x, y] = v.elements;
  let [r, g, b] = colorRGB.elements;

  // simulate a canvas size of 20x20 (is 1x1 in reality)
  const vertices = new Float32Array([0, 0, x / 20, y / 20]);

  const vBuffer = gl.createBuffer();

  if (!vBuffer) {
    console.error('Failed to create vertex buffer');
    return -1;
  }

  // assign attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPositionPtr = gl.getAttribLocation(gl.program, 'aPosition');
  gl.vertexAttribPointer(aPositionPtr, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(aPositionPtr);

  // assign uniforms
  const uColorPtr = gl.getUniformLocation(gl.program, 'uColor');
  gl.uniform4f(uColorPtr, r, g, b, 1);

  gl.drawArrays(gl.LINES, 0, 2);

  return 0;
};

const handleDrawRequest = (gl) => {
  clearCanvas(gl);

  let x1 = document.querySelector('#x1').value;
  let y1 = document.querySelector('#y1').value;
  let v1 = new Vector3([x1, y1, 0]);
  let red = new Vector3([1, 0, 0]);

  let x2 = document.querySelector('#x2').value;
  let y2 = document.querySelector('#y2').value;
  let v2 = new Vector3([x2, y2, 0]);
  let blue = new Vector3([0, 0, 1]);

  drawLine(gl, v1, red); // red line
  drawLine(gl, v2, blue); // red line

  return [v1, v2];
};

const handleOperationRequest = (gl) => {
  const [v1, v2] = handleDrawRequest(gl);

  const op = document.querySelector('#op').value;
  let green = new Vector3([0, 1, 0]);

  switch (op) {
    case 'add': {
      v1.add(v2);
      drawLine(gl, v1, green);
      break;
    }

    case 'sub': {
      v1.sub(v2);
      drawLine(gl, v1, green);
      break;
    }

    case 'mul': {
      let scalar = document.querySelector('#scalar').value;
      v1.mul(scalar);
      drawLine(gl, v1, green);
      v2.mul(scalar);
      drawLine(gl, v2, green);
      break;
    }

    case 'div': {
      let scalar = document.querySelector('#scalar').value;
      v1.div(scalar);
      drawLine(gl, v1, green);
      v2.div(scalar);
      drawLine(gl, v2, green);
      break;
    }

    case 'mag': {
      console.log(`Magnitude of v1 is ${v1.magnitude()}`);
      console.log(`Magnitude of v2 is ${v2.magnitude()}`);
      break;
    }

    case 'norm': {
      v1.normalize();
      drawLine(gl, v1, green);
      v2.normalize();
      drawLine(gl, v2, green);
      break;
    }

    case 'angle': {
      let m1 = v1.magnitude();
      let m2 = v2.magnitude();

      let theta = Math.acos(Vector3.dot(v1, v2) / m1 / m2);

      theta *= 180 / Math.PI;

      console.log(`The angle between v1 and v2 is: ${theta}deg`);
      break;
    }

    case 'area': {
      let v3 = Vector3.cross(v1, v2);
      let m = v3.magnitude();

      console.log(`The area of the triangle spanned by v1 and v2 is: ${m / 2}`);

      break;
    }

    default: {
      console.error('Something went wrong choosing an operation');
      break;
    }
  }
};

// init webGL context
const gl = init();

document.querySelector('#drawRequest').onclick = () => {
  handleDrawRequest(gl);
};

document.querySelector('#operationRequest').onclick = () => {
  handleOperationRequest(gl);
};
