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

const initVertices = (gl, shape, segments) => {
  switch (shape) {
    case 'triangle': {
      var vertices = new Float32Array([
        // v0
        0, 0.5,
        // v1
        -0.5, -0.5,
        // v2
        0.5, -0.5,
      ]);

      break;
    }

    case 'square': {
      var vertices = new Float32Array([
        // v0
        -0.5, 0.5,
        // v1
        -0.5, -0.5,
        // v2
        0.5, 0.5,
        // v3
        0.5, -0.5,
      ]);

      break;
    }

    case 'circle': {
      let v = [0, 0];
      let a = 0;

      for (var i = 0; i <= segments; i++) {
        v.push(Math.cos(a) / 2);
        v.push(Math.sin(a) / 2);

        a += (2 * Math.PI) / segments;
      }

      var vertices = new Float32Array(v);

      break;
    }
  }

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
  const aPositionPtr = gl.getAttribLocation(gl.program, 'aPosition');
  gl.vertexAttribPointer(aPositionPtr, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPositionPtr);

  vertices = null;
};

const drawShapes = (e, gl) => {
  let shape = document.getElementById('shape').value;
  let scale = document.getElementById('scale').value;
  let segments = parseInt(document.getElementById('segments').value);

  let x = (e.offsetX / 400) * 2 - 1;
  let y = -((e.offsetY / 400) * 2 - 1);

  let r = document.getElementById('red').value;
  let g = document.getElementById('green').value;
  let b = document.getElementById('blue').value;

  states.shapes.push(shape);
  states.scales.push(scale);
  states.segments.push(segments);
  states.clicks.push(x);
  states.clicks.push(y);
  states.colors.push(r);
  states.colors.push(g);
  states.colors.push(b);

  const uScaleMatrixPtr = gl.getUniformLocation(gl.program, 'uScaleMatrix');
  const uTranslationMatrixPtr = gl.getUniformLocation(
    gl.program,
    'uTranslationMatrix'
  );
  const uColorPtr = gl.getUniformLocation(gl.program, 'uColor');

  var translationMatrix = new Matrix4();
  let scaleMatrix = new Matrix4();

  clearCanvas(gl);

  var lastShape = states.shapes[0];
  var lastSegments = states.segments[0];
  initVertices(gl, lastShape, lastSegments);

  for (var i = 0; i < states.shapes.length; i++) {
    if (lastShape !== states.shapes[i]) {
      lastShape = states.shapes[i];
      initVertices(gl, lastShape, lastSegments);
    }

    if (lastSegments !== states.segments[i]) {
      lastSegments = states.segments[i];
      initVertices(gl, lastShape, lastSegments);
    }

    scaleMatrix.setScale(states.scales[i], states.scales[i], 0);
    translationMatrix.setTranslate(
      states.clicks[i * 2],
      states.clicks[i * 2 + 1],
      0
    );

    // assign uniforms
    gl.uniformMatrix4fv(uScaleMatrixPtr, false, scaleMatrix.elements);
    gl.uniformMatrix4fv(
      uTranslationMatrixPtr,
      false,
      translationMatrix.elements
    );

    gl.uniform3f(
      uColorPtr,
      states.colors[i * 3],
      states.colors[i * 3 + 1],
      states.colors[i * 3 + 2]
    );

    switch (lastShape) {
      case 'triangle': {
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        break;
      }
      case 'square': {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        break;
      }
      case 'circle': {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, states.segments[i] + 2);
        break;
      }
    }
  }

  scaleMatrix = null;
  translationMatrix = null;
};

// init webGL context
const gl = init();

const states = {
  clicks: [],
  scales: [],
  shapes: [],
  colors: [],
  segments: [],
  dragging: false,
};

if (gl) {
  const vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

  document.getElementById('clear').onclick = () => {
    states.clicks = [];
    states.scales = [];
    states.segments = [];
    states.shapes = [];
    states.colors = [];
    clearCanvas(gl);
  };

  document.getElementById('segments').onchange = (e) => {
    document.querySelector(
      '.segs strong'
    ).textContent = `Circle Segments (${e.target.value}):`;
  };

  gl.canvas.onclick = (e) => drawShapes(e, gl);
  gl.canvas.onmousemove = (e) => {
    e.buttons === 1 ? drawShapes(e, gl) : null;
  };
} else {
  console.error('There was an error getting the webGL context');
}
