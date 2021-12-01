import Experience from '..';
import Environment from './Environment';
import SphereOcean from './SphereOcean';
import Platform from './Platform';
import Flames from './Flames';

export default class World {
  constructor() {
    // retrieve singleton instance of Experience
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;

    return this;
  }

  update() {
    if (this.fox) this.fox.update();
  }

  load() {
    this.environment = new Environment();
    this.ocean = new SphereOcean();
    this.platform = new Platform();
    this.flames = new Flames();
  }
}
