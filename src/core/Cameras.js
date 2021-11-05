import { Matrix4, Vector3 } from '../../lib/cuon-matrix-cse160';
import { Object3D } from './Object3D';

var _v3 = new Vector3();

class PerspectiveCamera extends Object3D {
  constructor({
    position,
    target = [0, 0, 0],
    fov = 60,
    near = 0.01,
    far = 100,
    rotation = [0, 0, 0],
  }) {
    super({ position, rotation });

    window.addEventListener('resize', (e) => {
      this.aspect = e.target.innerWidth / e.target.innerHeight;

      this.calculateViewProjection();
    });

    this.type = 'camera';
    this.aspect = window.innerWidth / window.innerHeight;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.lastRotation = new Vector3(rotation);

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.target = new Vector3(target);

    this.calculateViewProjection();
  }

  calculateViewProjection() {
    this.viewMatrix.setLookAt(
      ...this.position.elements,
      ...this.target.elements,
      ...this.up.elements
    );

    this.projectionMatrix.setPerspective(
      this.fov,
      this.aspect,
      this.near,
      this.far
    );
  }

  setRotation(x, y, z) {
    super.setRotation(x, y, z);

    _v3.set(this.target);
    _v3.sub(this.position);

    let r = _v3.magnitude();

    let theta = Math.acos(_v3.elements[1] / r);

    let phi = Math.atan2(_v3.elements[2], _v3.elements[0]);

    _v3.set(this.lastRotation);
    _v3.sub(this.rotation);

    let deltas = _v3.elements;

    theta += (deltas[0] * Math.PI) / 180;
    phi += (deltas[1] * Math.PI) / 180;

    const newX = r * Math.cos(phi) * Math.sin(theta);
    const newY = r * Math.cos(theta);
    const newZ = r * Math.sin(phi) * Math.sin(theta);

    _v3.set([newX, newY, newZ]);
    this.target.set(this.position);
    this.target.add(_v3);

    this.lastRotation.set(this.rotation);

    this.calculateViewProjection();
  }

  setPosition(x, y, z) {
    super.setPosition(x, y, z);

    this.calculateViewProjection();
  }
}

export { PerspectiveCamera };
