// vertex shader
const vert = `
attribute vec4 aPosition;

void main() {
  gl_Position = aPosition;
  gl_PointSize = 10.;
}
`;

// fragment shader
const frag = `
precision mediump float;
uniform vec4 uColor;

void main() {
  gl_FragColor = uColor;
}
`;

const clearCanvas = (gl) => {
  // clear cavas to black
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

// draw vector v
const drawLine = (gl, v, colorRGB) => {
  let [x, y] = [...v.elements];
  let [r, g, b] = [...colorRGB];

  // simulate a canvas size of 20x20 (is 1x1 in reality)
  const vertices = new Float32Array([0, 0, x / 20, y / 20]);
  const color = new Float32Array([]);

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

  return 2;
};

const handleClick = (gl, del = true) => {
  clearCanvas(gl);

  let x1 = document.querySelector('#x1').value;
  let y1 = document.querySelector('#y1').value;
  let v1 = new Vector3([x1,y1,0]);

  let x2 = document.querySelector('#x2').value;
  let y2 = document.querySelector('#y2').value;
  let v2 = new Vector3([x2,y2,0])

  drawLine(gl, v1, [1, 0, 0]); // red line
  drawLine(gl, v2, [0, 0, 1]); // red line

  if (del) {
    delete v1;
    delete v2;
  } else {
    return [v1,v2];
  }
};

const handleOperation = (gl) => {
  const [v1,v2] = [...handleClick(gl, false)];

  const op = document.querySelector('#op').value;

  switch (op) {
    case 'add': {
      v1.add(v2);
      drawLine(gl, v1, [0,1,0]);
      break;
    }

    case 'sub': {
      v1.sub(v2);
      drawLine(gl, v1, [0,1,0]);
      break;
    }

    case 'mul': {
      let scalar = document.querySelector('#scalar').value
      v1.mul(scalar);
      drawLine(gl, v1, [0,1,0]);
      v2.mul(scalar);
      drawLine(gl, v2, [0,1,0]);
      break;
    }

    case 'div': {
      let scalar = document.querySelector('#scalar').value
      v1.div(scalar);
      drawLine(gl, v1, [0,1,0]);
      v2.div(scalar);
      drawLine(gl, v2, [0,1,0]);
      break;
    }

    case 'mag': {
      console.log(`Magnitude of v1 is ${v1.magnitude()}`)
      console.log(`Magnitude of v2 is ${v2.magnitude()}`)
      break;
    }

    case 'norm': {
      v1.normalize();
      drawLine(gl, v1, [0,1,0]);
      v2.normalize();
      drawLine(gl, v2, [0,1,0]);
      break;
    }

    case 'angle': {
      let m1 = v1.magnitude();
      let m2 = v2.magnitude();

      let theta = Math.acos(Vector3.dot(v1,v2) / m1 / m2);

      theta *= 180 / Math.PI;

      console.log(`The angle between v1 and v2 is: ${theta}deg`)
      break;
    }

    case 'cross': {
      let v3 = Vector3.cross(v1,v2);
      drawLine(gl, v3, [0,1,0]);
      delete v3;
      break;
    }

    default: {
      console.error('Something went wrong choosing an operation');
      break;
    }
  }

  delete v1;
  delete v2;
}

function main() {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webGL');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  // get ctx from canvas
  const gl = getWebGLContext(canvas);

  if (!gl) {
    console.error('Failed to retrieve context for the WebGL canvas');
    return;
  }

  if (!initShaders(gl, vert, frag)) {
    console.error('Failed to init shaders');
    return;
  }

  handleClick(gl);

  
}
