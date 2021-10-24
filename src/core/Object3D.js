import { Vector3, Matrix4 } from '../../lib/cuon-matrix-cse160';
import { createProgram } from '../../lib/cuon-utils';

let _scaleMatrix = new Matrix4();
let _rotMatrix = new Matrix4();
let _translateMatrix = new Matrix4();
let _matrix = new Matrix4();
let _norm = new Matrix4().setScale(1, 1, 1);

class Attribute {
  constructor(array, count, name) {
    if (Array.isArray(array)) {
      this.value = new Float32Array(array);
    } else {
      this.value = array;
    }

    this.countPerVertex = count;
    this.name = name;
    this.buffer = null;
    this.location = null;
  }
}

class Uniform {
  constructor(array, count, type) {
    if (Array.isArray(array)) {
      this.value = new Float32Array(array);
    } else if (array === null) {
      this.value = new Float32Array(count);
    } else {
      this.value = array;
    }

    this.count = count;
    this.type = type;

    this.location = null;
  }
}

class Object3D {
  constructor({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  }) {
    this.type = 'Object3D';

    // transforms
    this.position = new Vector3(position);
    this.scale = new Vector3(scale);
    this.rotation = new Vector3(rotation);

    // matrices
    this.scaleMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.translationMatrix = new Matrix4();

    // scene graph related
    this.parent = null;
    this.children = [];

    // object data
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();
    this.renderMatrix = new Matrix4();
    this.up = new Vector3([0, 1, 0]);
    this.drawMode = 'static';
    this.drawType = 'triangles';
    this.visible = false;
    this.transparent = false;
    this.attributes = [
      // new Attribute([0, 0, 0], 3, aPosition), example: a single vertex
    ];
    this.uniforms = {
      // default uniforms
      uMouse: new Uniform(null, 2, 'vec2'),
      uTime: new Uniform(null, 1, 'float'),
      uResolution: new Uniform(null, 2, 'vec2'),
      viewMatrix: new Uniform(null, 16, 'mat4'),
      projectionMatrix: new Uniform(null, 16, 'mat4'),
      modelMatrix: new Uniform(null, 16, 'mat4'),
      uColor: new Uniform(new Float32Array([1, 1, 1]), 3, 'vec3'),
    };

    this.indices = []; // indices of vertices to draw triangles from, in order
    this.indexBuffer = null;
    this.indexLocation = null;
    this.userData = {};

    // shader program, will be compiled manually
    this.program = null;

    this.autoUpdateMatrix = true;

    this.calculateScaleMatrix();
    this.calculateRotationMatrix();
    this.calculateTranslationMatrix();
    this.recalculateMatrix();
  }

  add(children) {
    if (Array.isArray(children) && children.length > 0) {
      for (let child of children) {
        this.add(child);
      }
    } else {
      this.children.push(children);

      children.parent = this;
    }
  }

  remove(child) {
    let idx = this.children.indexOf(child);

    child.parent = null;
    this.children.splice(idx, 1);
  }

  getAlphaOrderedChildren() {
    return this.children.sort((a, b) => {
      return a.transparent ? 1 : -1;
    });
  }

  setPosition(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.position.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.position.set(x);
    } else {
      this.position.elements[0] = x;
      this.position.elements[1] = y;
      this.position.elements[2] = z;
    }

    this.calculateTranslationMatrix();
  }

  getPosition() {
    return [...this.position.elements];
  }

  setScale(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.scale.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.scale.set(x);
    } else {
      this.scale.elements[0] = x;
      this.scale.elements[1] = y;
      this.scale.elements[2] = z;
    }

    this.calculateScaleMatrix();
  }

  getScale() {
    return [...this.scale.elements];
  }

  setRotation(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.rotation.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.rotation.set(x);
    } else {
      this.rotation.elements[0] = x;
      this.rotation.elements[1] = y;
      this.rotation.elements[2] = z;
    }

    this.calculateRotationMatrix();
  }

  getRotation() {
    return [...this.rotation.elements];
  }

  setUpDirection(x, y, z) {
    if (Array.isArray(x)) {
      for (let i = 0; i < 3; i++) {
        this.up.elements[i] = x[i];
      }
    } else if (x.elements) {
      this.up.set(x);
    } else {
      this.up.elements[0] = x;
      this.up.elements[1] = y;
      this.up.elements[2] = z;
    }
  }

  getUpDirection() {
    return [...this.up.elements];
  }

  setShaderProgram(gl, vert, frag) {
    this.program = createProgram(gl, vert, frag);

    if (!this.program) {
      console.warn(`Failed to compile program for ${this}`);
    }
  }

  traverse(callback) {
    callback(this);

    for (let child of this.getAlphaOrderedChildren()) {
      child.traverse(callback);
    }
  }

  setColor(r, g, b) {
    if (Array.isArray(r)) {
      for (let i = 0; i < 3; i++) {
        this.uniforms.uColor.value[i] = r[i];
      }
    } else if (r.elements) {
      this.uniforms.uColor.value.set(r);
    } else {
      this.uniforms.uColor.value[0] = r;
      this.uniforms.uColor.value[1] = g;
      this.uniforms.uColor.value[2] = b;
    }
  }

  calculateScaleMatrix() {
    this.scaleMatrix.setScale(...this.scale.elements);
  }

  calculateRotationMatrix() {
    this.rotationMatrix.setRotate(this.rotation.elements[0], 1, 0, 0);
    this.rotationMatrix.rotate(this.rotation.elements[1], 0, 1, 0);
    this.rotationMatrix.rotate(this.rotation.elements[2], 0, 0, 1);
  }

  calculateTranslationMatrix() {
    this.translationMatrix.setTranslate(...this.position.elements);
  }

  getScaleMatrix() {
    return _scaleMatrix.set(this.scaleMatrix);
  }

  getRotationMatrix() {
    return _rotMatrix.set(this.rotationMatrix);
  }

  getTranslationMatrix() {
    return _translateMatrix.set(this.translationMatrix);
  }

  getMatrix() {
    this.calculateMatrix();
    return this.matrix;
  }

  getMatrixWorld() {
    this.calculateWorldMatrix();
    return this.matrixWorld;
  }

  calculateMatrix() {
    this.matrix
      .set(this.translationMatrix)
      .multiply(this.rotationMatrix)
      .multiply(this.scaleMatrix);
  }

  calculateWorldMatrix() {
    if (this.parent !== null) {
      this.matrixWorld
        .set(this.parent.getMatrixWorld())
        .multiply(this.translationMatrix)
        .multiply(this.rotationMatrix);
    } else {
      this.matrixWorld
        .set(this.translationMatrix)
        .multiply(this.rotationMatrix);
    }
  }

  recalculateMatrix() {
    if (this.autoUpdateMatrix) {
      this.calculateMatrix();
    }
    this.calculateWorldMatrix();

    this.renderMatrix.set(this.matrixWorld).multiply(this.scaleMatrix);

    this.uniforms.modelMatrix.value.set(this.renderMatrix.elements);
  }
}

export { Object3D, Attribute, Uniform };
