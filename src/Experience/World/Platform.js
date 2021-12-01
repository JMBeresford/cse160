import { Mesh, PlaneGeometry, MeshStandardMaterial, DoubleSide } from 'three';
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
        this.mesh.material = new MeshStandardMaterial({
          color: '#020203',
          roughness: 0.1,
          metalness: 0,
        });
      }
    });
  }

  setInstance() {
    this.mesh.position.set(0, -1, 0);
    this.mesh.rotation.y = Math.PI * 0.5 + 0.18;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }
}
