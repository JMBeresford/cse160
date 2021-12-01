import Experience from '.';
import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
  constructor(fov = 35, near = 0.1, far = 400) {
    // grab singleton instance of Experience
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    // set up camera object
    this.setInstance(fov, near, far);
    this.setControls();

    return this;
  }

  setInstance(fov, near, far) {
    this.instance = new PerspectiveCamera(
      fov,
      this.sizes.width / this.sizes.height,
      near,
      far
    );

    this.instance.position.set(0, 5, 25);
    this.instance.lookAt(0, 105.06, -170.18);

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.target.set(0, 8, 0);
    // this.controls.target.set(0, 105.06, -170.18);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    // this.controls.enableZoom = false;
    this.controls.maxPolarAngle = Math.PI * 0.55;
    this.controls.minPolarAngle = Math.PI * 0.35;
    this.controls.maxDistance = 35;

    // this.canvas.onclick = () => {
    //   this.controls.lock();
    // };
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
