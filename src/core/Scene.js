import { Object3D } from './Object3D';

class Scene extends Object3D {
  constructor(position, rotation) {
    super(position, rotation, [1, 1, 1]);

    this.type = 'scene';
    this.autoUpdateMatrix = true;
    this.visible = false;
  }
}

export { Scene };
