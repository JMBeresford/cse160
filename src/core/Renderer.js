import { Vector3 } from '../../lib/cuon-matrix-cse160';
import { getWebGLContext, initShaders } from '../../lib/cuon-utils';

class Renderer {
  constructor(canvas) {
    if (canvas === null) {
      console.warn('Could not find the canvas element!');
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.gl = getWebGLContext(canvas);

    window.addEventListener('resize', (e) => {
      this.gl.canvas.width = e.target.innerWidth;
      this.gl.canvas.height = e.target.innerHeight;

      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    });

    if (!this.gl) {
      console.warn('Could not get the webGL context!');
      return;
    }

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.clear();
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  setClearColor(r, g, b, a) {
    if (typeof r === 'object') {
      this.gl.clearColor(r);
    } else {
      this.gl.clearColor(r, g, b, a);
    }
  }

  loadShaders(vert, frag) {
    if (!initShaders(this.gl, vert, frag)) {
      console.warn('Error loading shaders!', vert, frag);
    }
  }

  render(scene, camera) {
    this.clear();

    scene.traverse((obj) => {
      if (obj.autoUpdateMatrix) {
        obj.recalculateMatrix();
      }

      if (obj.visible === false) {
        return;
      }

      this.loadShaders(obj.shaders.vertex, obj.shaders.fragment);

      let viewMatrixPtr = this.gl.getUniformLocation(
        this.gl.program,
        'viewMatrix'
      );

      let projectionMatrixPtr = this.gl.getUniformLocation(
        this.gl.program,
        'projectionMatrix'
      );

      let uResolutionPtr = this.gl.getUniformLocation(
        this.gl.program,
        'uResolution'
      );

      this.gl.uniform2f(
        uResolutionPtr,
        this.gl.canvas.width,
        this.gl.canvas.height
      );

      this.gl.uniformMatrix4fv(
        viewMatrixPtr,
        false,
        camera.viewMatrix.elements
      );

      this.gl.uniformMatrix4fv(
        projectionMatrixPtr,
        false,
        camera.projectionMatrix.elements
      );

      let buffers = {};
      let drawMode;
      let drawType;

      switch (obj.drawMode) {
        case 'static': {
          drawMode = this.gl.STATIC_DRAW;
          break;
        }
        case 'stream': {
          drawMode = this.gl.STREAM_DRAW;
          break;
        }
        default: {
          drawMode = this.gl.DYNAMIC_DRAW;
          break;
        }
      }

      switch (obj.drawType) {
        case 'triangles': {
          drawType = this.gl.TRIANGLES;
          break;
        }
        case 'triangle_fan': {
          drawType = this.gl.TRIANGLE_FAN;
          break;
        }
        case 'triangle_strip': {
          drawType = this.gl.TRIANGLE_STRIP;
          break;
        }
        case 'lines': {
          drawType = this.gl.LINES;
          break;
        }
        case 'lines_strip': {
          drawType = this.gl.LINE_STRIP;
          break;
        }
        case 'lines_loop': {
          drawType = this.gl.LINE_LOOP;
          break;
        }
        default: {
          drawType = this.gl.POINTS;
          break;
        }
      }

      for (let attribute of obj.attributes) {
        buffers[attribute.name] = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers[attribute.name]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, attribute.value, drawMode);

        let attribPtr = this.gl.getAttribLocation(
          this.gl.program,
          attribute.name
        );

        if (attribPtr === -1) {
          continue;
        }

        this.gl.vertexAttribPointer(
          attribPtr,
          attribute.countPerVertex,
          this.gl.FLOAT,
          false,
          0,
          0
        );

        this.gl.enableVertexAttribArray(attribPtr);
      }

      for (let uniform of obj.uniforms) {
        let uniformPtr = this.gl.getUniformLocation(
          this.gl.program,
          uniform.name
        );

        switch (uniform.type) {
          case 'vec1': {
            this.gl.uniform1f(uniformPtr, ...uniform.value);
            break;
          }
          case 'vec2': {
            this.gl.uniform2f(uniformPtr, ...uniform.value);
            break;
          }
          case 'vec3': {
            this.gl.uniform3f(uniformPtr, ...uniform.value);
            break;
          }
          case 'vec4': {
            this.gl.uniform4f(uniformPtr, ...uniform.value);
            break;
          }

          case 'mat3': {
            this.gl.uniformMatrix3fv(uniformPtr, false, uniform.value);
            break;
          }
          case 'mat4': {
            this.gl.uniformMatrix4fv(uniformPtr, false, uniform.value);
            break;
          }
        }
      }

      buffers['indices'] = this.gl.createBuffer();

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffers['indices']);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, obj.indices, drawMode);

      this.gl.drawElements(
        drawType,
        obj.indices.length,
        this.gl.UNSIGNED_BYTE,
        0
      );
    });
  }
}

export { Renderer };
