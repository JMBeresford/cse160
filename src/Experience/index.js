import { Clock, Debug, Resources, Sizes } from './Utils';
import Camera from './Camera';
import Renderer from './Renderer';
import { Mesh, Scene } from 'three';
import World from './World';
import Loading from './Loading';
import sources from './sources';

export default class Experience {
  constructor(canvas) {
    // singleton class
    if (Experience._instance) {
      return Experience._instance;
    } else {
      Experience._instance = this;
    }

    /**
     * Canvas Element
     */
    this.canvas = canvas ? canvas : document.getElementById('webGL');

    if (!this.canvas) {
      console.error('Could not find canvas element.');
      return;
    }

    /**
     * Debug
     */
    this.debug = new Debug();

    /**
     * Sizes
     */
    this.sizes = new Sizes();

    this.sizes.on('resize', () => {
      this.resize();
    });

    /**
     * Clock
     */
    this.clock = new Clock();

    this.clock.on('tick', () => {
      this.update();
    });

    this.regressLevel = 0;

    /**
     * Scene
     */
    this.scene = new Scene();

    /**
     * Camera
     */
    this.camera = new Camera();

    /**
     * Renderer
     */
    this.renderer = new Renderer();

    /**
     * Resources
     */
    this.resources = new Resources(sources);

    this.loading = new Loading();

    /**
     * World
     */
    this.world = new World();

    return this;
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (this.debug.active) {
      this.debug.stats.begin();
    }

    this.camera.update();
    this.renderer.update();
    if (this.world) {
      this.world.update();
    }

    if (this.debug.active) {
      this.debug.stats.end();
    }
  }

  destroy() {
    this.sizes.off('resize');
    this.clock.off('tick');

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();

    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.pane.dispose();
    }
  }
}
