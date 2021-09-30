import vertexShader from './shaders/default.vert';
import fragmentShader from './shaders/default.frag';
import { getWebGLContext, initShaders } from '../lib/cuon-utils';

// clear cavas to black
const clearCanvas = (gl) => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

const init = () => {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

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

  if (!initShaders(gl, vertexShader, fragmentShader)) {
    console.error('Failed to init shaders');
    return;
  }

  clearCanvas(gl);

  return gl;
};

export { init, clearCanvas };
