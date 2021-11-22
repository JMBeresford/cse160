import { getWebGLContext } from '../../lib/cuon-utils';

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
    this.lights = {
      ambient: { intensity: null, color: null },
      point: {
        intensity: null,
        color: null,
        position: null,
        specularExponent: null,
      },
      spot: {
        intensity: null,
        color: null,
        position: null,
        specularExponent: null,
        target: null,
        angle: null,
      },
    };

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.cullFace(this.gl.BACK);
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
      if (attribute.buffer === null) {
        attribute.buffer = this.gl.createBuffer();
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

      if (
        name === 'uAmbientIntensity' &&
        this.lights.ambient.intensity !== null
      ) {
        uniforms[name].value[0] = this.lights.ambient.intensity;
      }

      if (name === 'uAmbientColor' && this.lights.ambient.color !== null) {
        uniforms[name].value = this.lights.ambient.color;
      }

      if (
        name === 'uPointLightIntensity' &&
        this.lights.point.intensity !== null
      ) {
        uniforms[name].value[0] = this.lights.point.intensity;
      }

      if (name === 'uPointLightColor' && this.lights.point.color !== null) {
        uniforms[name].value = this.lights.point.color;
      }

      if (name === 'uPointLightPos' && this.lights.point.position !== null) {
        uniforms[name].value = this.lights.point.position;
      }

      if (
        name === 'uSpecularExponent' &&
        this.lights.point.specularExponent !== null
      ) {
        uniforms[name].value[0] = this.lights.point.specularExponent;
      }

      if (
        name === 'uSpotLightIntensity' &&
        this.lights.spot.intensity !== null
      ) {
        uniforms[name].value[0] = this.lights.spot.intensity;
      }

      if (name === 'uSpotLightColor' && this.lights.spot.color !== null) {
        uniforms[name].value = this.lights.spot.color;
      }

      if (name === 'uSpotLightPos' && this.lights.spot.position !== null) {
        uniforms[name].value = this.lights.spot.position;
      }

      if (
        name === 'uSpotSpecularExponent' &&
        this.lights.spot.specularExponent !== null
      ) {
        uniforms[name].value[0] = this.lights.spot.specularExponent;
      }

      if (name === 'uSpotLightAngle' && this.lights.spot.angle !== null) {
        uniforms[name].value[0] = (this.lights.spot.angle * Math.PI) / 180;
      }

      if (name === 'uSpotLightTarget' && this.lights.spot.target !== null) {
        uniforms[name].value = this.lights.spot.target;
      }

      if (name === 'uCamPos') {
        uniforms[name].value = camera.position.elements;
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
        case 'int': {
          if (name === 'uTexture') {
            this.gl.bindTexture(this.gl.TEXTURE_2D, obj.texture);
            this.gl.activeTexture(this.gl.TEXTURE0);
          }

          this.gl.uniform1i(uniformPtr, ...uniforms[name].value);
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
    }

    this.gl.enable(this.gl.DEPTH_TEST);
  }

  render(scene, camera) {
    this.clear();

    let noDepthTest = [];
    let opaque = [];
    let transparent = [];

    scene.traverse((obj) => {
      if (obj.type === 'ambient light') {
        this.lights.ambient.intensity = obj.intensity;
        this.lights.ambient.color = obj.uniforms.uColor.value;
      }

      if (obj.type === 'point light') {
        this.lights.point.intensity = obj.intensity;
        this.lights.point.color = obj.uniforms.uColor.value;
        this.lights.point.position = obj.position.elements;
        this.lights.point.specularExponent = obj.specularExponent;
      }

      if (obj.type === 'spot light') {
        this.lights.spot.intensity = obj.intensity;
        this.lights.spot.color = obj.uniforms.uColor.value;
        this.lights.spot.position = obj.position.elements;
        this.lights.spot.specularExponent = obj.specularExponent;
        this.lights.spot.target = obj.target;
        this.lights.spot.angle = obj.cutoffAngle;
      }

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
