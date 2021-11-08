import { PointerLockControls } from './core/utils/PointerLockControls';
import { Vector3 } from '../lib/cuon-matrix-cse160';
import { Uniform } from './core/Object3D';

var _v1 = new Vector3();
var _v2 = new Vector3();

class Controls extends PointerLockControls {
  constructor(camera, canvas, world, camBody) {
    super(camera, canvas, camBody, false);

    this.world = world;

    return this;
  }

  update = () => {
    super.update();

    let [, fy] = this.world.getPosition();
    let [cx, cy, cz] = this.camera.getPosition();

    this.world.setPosition([cx, fy, cz]);
    for (let child of this.world.children) {
      if (!child.uniforms['uCameraPos']) {
        child.uniforms['uCameraPos'] = new Uniform(
          this.camera.getPosition(),
          3,
          'vec3'
        );
      }
      child.uniforms['uCameraPos'].value = this.camera.getPosition();
    }
  };
}

export { Controls };
