import { Vector3 } from '../../../lib/cuon-matrix-cse160';
import { Object3D } from '../Object3D';

class AmbientLight extends Object3D {
  constructor(color = [1, 1, 1], intensity = 1.0) {
    super();

    this.type = 'ambient light';

    this.setColor(color);
    this.intensity = intensity;

    return this;
  }
}

export { AmbientLight };
