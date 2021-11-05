import { Object3D } from './Object3D';

class Scene extends Object3D {
  constructor({ position, rotation }) {
    super({ position, scale: [1, 1, 1], rotation });

    this.type = 'scene';
    this.autoUpdateMatrix = true;
    this.visible = false;
  }
}

export { Scene };
