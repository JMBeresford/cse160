import { Matrix4 } from '../../lib/cuon-matrix-cse160';
import defaultVertexShader from './shaders/default.vert';
import defaultFragmentShader from './shaders/default.frag';
import { getWebGLContext, createProgram } from '../../lib/cuon-utils';

var _mat1 = new Matrix4();
var _mat2 = new Matrix4();
class Renderer {
  constructor(canvas) {
    if (canvas === null) {
      console.warn('Could not find the canvas element!');
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.gl = getWebGLContext(canvas, false, {
      alpha: true,
      premultipliedAlpha: true,
    });

    window.addEventListener('resize', (e) => {
      this.gl.canvas.width = e.target.innerWidth;
      this.gl.canvas.height = e.target.innerHeight;

      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    });

    if (!this.gl) {
      console.warn('Could not get the webGL context!');
      return;
    }

    this.viewMatrixLocation = null;
    this.projectionMatrixLocation = null;
    this.resolutionLocation = null;

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
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

  renderObject(obj, camera) {
    if (obj.depthTest == false) {
      this.gl.disable(this.gl.DEPTH_TEST);
    }

    if (obj.autoUpdateMatrix) {
      obj.recalculateMatrix();
    }

    if (obj.transparent == true) {
      this.gl.depthMask(false);
    } else {
      this.gl.depthMask(true);
    }

    if (obj.visible === false) {
      this.gl.enable(this.gl.DEPTH_TEST);
      return;
    }

    if (!obj.program) {
      if (obj.vertexShader !== null && obj.fragmentShader !== null) {
        obj.setShaderProgram(this.gl, obj.vertexShader, obj.fragmentShader);
      } else {
        console.error('Could not compile shader for object:', obj);
      }
    }

    this.gl.useProgram(obj.program);
    this.gl.program = obj.program;

    obj.uniforms.viewMatrix.value.set(camera.viewMatrix.elements);
    obj.uniforms.projectionMatrix.value.set(camera.projectionMatrix.elements);
    obj.uniforms.uResolution.value.set([
      this.gl.canvas.width,
      this.gl.canvas.height,
    ]);

    let drawMode = this.gl.DYNAMIC_DRAW;
    var drawType = this.gl.TRIANGLES;

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
      let created = false;
      if (attribute.buffer === null) {
        attribute.buffer = this.gl.createBuffer();
        created = true;
      }

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, attribute.value, drawMode);

      if (attribute.location === null) {
        attribute.location = this.gl.getAttribLocation(
          this.gl.program,
          attribute.name
        );
      }

      const attribPtr = attribute.location;

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

    const uniforms = obj.uniforms;
    for (let name in uniforms) {
      if (uniforms[name].location === null) {
        uniforms[name].location = this.gl.getUniformLocation(
          this.gl.program,
          name
        );
      }

      let uniformPtr = uniforms[name].location;

      switch (uniforms[name].type) {
        case 'float': {
          this.gl.uniform1f(uniformPtr, ...uniforms[name].value);
          break;
        }
        case 'vec2': {
          this.gl.uniform2f(uniformPtr, ...uniforms[name].value);
          break;
        }
        case 'vec3': {
          this.gl.uniform3f(uniformPtr, ...uniforms[name].value);
          break;
        }
        case 'vec4': {
          this.gl.uniform4f(uniformPtr, ...uniforms[name].value);
          break;
        }

        case 'mat3': {
          this.gl.uniformMatrix3fv(uniformPtr, false, uniforms[name].value);
          break;
        }
        case 'mat4': {
          this.gl.uniformMatrix4fv(uniformPtr, false, uniforms[name].value);
          break;
        }
        default: {
          console.warn(
            `There was an error in the typing of your uniform ${name}`
          );
        }
      }
    }

    if (obj.indices !== null) {
      if (obj.indexBuffer === null) {
        obj.indexBuffer = this.gl.createBuffer();
      }

      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        obj.indices,
        this.gl.DYNAMIC_DRAW
      );

      this.gl.drawElements(
        drawType,
        obj.indices.length,
        this.gl.UNSIGNED_SHORT,
        0
      );
    } else {
      let aPos = obj.attributes.find((a) => a.name === 'aPosition');
      this.gl.drawArrays(drawType, 0, aPos.value.length / 3);
    }

    this.gl.enable(this.gl.DEPTH_TEST);
  }

  render(scene, camera) {
    this.clear();

    let noDepthTest = [];
    let opaque = [];
    let transparent = [];

    scene.traverse((obj) => {
      if (obj.depthTest == false) {
        noDepthTest.push(obj);
        return;
      }
      if (obj.transparent == true) {
        transparent.push(obj);
        return;
      }

      opaque.push(obj);
    });

    for (let obj of noDepthTest) {
      this.renderObject(obj, camera);
    }

    for (let obj of opaque) {
      this.renderObject(obj, camera);
    }

    for (let obj of transparent) {
      this.renderObject(obj, camera);
    }
  }
}

export { Renderer };
