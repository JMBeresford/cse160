import { AmbientLight, DirectionalLight } from 'three';
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
    this.sun = new DirectionalLight('white', 1);
    this.sun.position.set(0, 68.404, -187.94);
    this.sun.castShadow = true;

    this.scene.add(this.sun);
  }

  setAmbient() {
    this.ambientLight = new AmbientLight('#440066', 0.1);

    this.scene.add(this.ambientLight);
  }
}
