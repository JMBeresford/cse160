import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import Experience from '..';
import Environment from './Environment';

export default class World {
  constructor() {
    // retrieve singleton instance of Experience
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;

    this.resources.on('ready', () => {
      this.environment = new Environment();
    });

    return this;
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
