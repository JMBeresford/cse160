import { Matrix4, Vector3 } from '../../lib/cuon-matrix-cse160';
import { Object3D } from './Object3D';

class PerspectiveCamera extends Object3D {
  constructor({ position, target, fov = 75, near = 0.01, far = 20 }) {
    super({ position });

    if (target && !target.elements) {
      console.error('Target must be of type Vector3');
      return;
    }

    window.addEventListener('resize', (e) => {
      this.aspect = e.target.innerWidth / e.target.innerHeight;

      this.calculateViewProjection();
    });

    this.type = 'camera';
    this.aspect = window.innerWidth / window.innerHeight;
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.target = target || new Vector3([0, 0, 0]);

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
}

export { PerspectiveCamera };
