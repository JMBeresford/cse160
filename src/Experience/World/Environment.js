import {
  AmbientLight,
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
} from 'three';
import Experience from '..';
import Skydome from './Skydome';

export default class Environment {
  constructor() {
    // grab singleton class instance
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.skydome = new Skydome();

    this.setSun();
    this.setAmbient();

    return this;
  }

  setSun() {
    this.sun = new DirectionalLight('white', 2);
    this.sun.position.set(0, 6.8404, -18.794);
    this.sun.castShadow = true;

    this.sun.shadow.mapSize.width = 1024;
    this.sun.shadow.mapSize.height = 1024;
    this.sun.shadow.camera.far = 30;

    this.sun.shadow.camera.left = -10;
    this.sun.shadow.camera.bottom = -10;
    this.sun.shadow.camera.right = 10;
    this.sun.shadow.camera.top = 10;

    this.scene.add(this.sun);
  }

  setAmbient() {
    this.ambientLight = new AmbientLight('#440050', 0.3);

    this.scene.add(this.ambientLight);
  }
}
