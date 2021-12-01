import { Mesh } from 'three';
import Experience from '..';

export default class Platform {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;

    this.setModel();
    this.setInstance();

    return this;
  }

  setModel() {
    this.model = this.resources.items['platformModel'];

    this.model.scene.traverse((child) => {
      if (child.isMesh) {
        this.mesh = child;
      }
    });
  }

  setInstance() {
    this.mesh.position.set(0, -1, 0);
    this.mesh.rotation.y = Math.PI * 0.5 + 0.18;
    this.mesh.castShadow = true;
    this.mesh.recieveShadow = true;
    this.scene.add(this.mesh);
  }
}
