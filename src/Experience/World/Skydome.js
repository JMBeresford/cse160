import vertexShader from '../../shaders/sky/vert.glsl';
import fragmentShader from '../../shaders/sky/frag.glsl';
import Experience from '..';
import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from 'three';

export default class Skydome {
  constructor() {
    // grab singleton class instance
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.clock = this.experience.clock;
    this.FBM_OCTAVES = 6;

    this.setGeometry();
    this.setUniforms();
    this.setMaterial();
    this.setRegress();
    this.setInstance();

    if (this.experience.debug.active) {
      this.debug = this.experience.debug;
      this.debugFolder = this.debug.pane.addFolder({
        title: 'Sky',
        expanded: false,
      });

      this.debugParams = {
        Color: {
          r: this.uniforms.uColor.value.r * 255,
          g: this.uniforms.uColor.value.g * 255,
          b: this.uniforms.uColor.value.b * 255,
        },
        CloudColor: {
          r: this.uniforms.uCloudColor.value.r * 255,
          g: this.uniforms.uCloudColor.value.g * 255,
          b: this.uniforms.uCloudColor.value.b * 255,
        },
      };

      this.setDebug();
    }

    return this;
  }

  setGeometry() {
    this.geometry = new SphereGeometry(200);
  }

  setUniforms() {
    this.uniforms = {
      uTime: { value: this.clock.elapsed },
      uColor: { value: new Color('#292124') },
      uFogColor: { value: new Color('#151111') },
      uCloudColor: { value: new Color('#fb8c90') },
    };

    this.clock.on('tick', () => {
      this.uniforms.uTime.value = this.clock.elapsed;
    });
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: BackSide,
      uniforms: this.uniforms,
      defines: {
        FBM_OCTAVES: this.FBM_OCTAVES,
      },
    });
  }

  /**
   * Checks performance in terms of FPS and scales down details until target (>=50 FPS) is reached
   */
  regress() {
    let t = this.clock.current / 1000; // in seconds
    this.regeressFrames.push(1000 / this.clock.delta);

    // regress at most once per 0.15 seconds
    if (t - this.lastRegressCheck > 0.15) {
      let fps = 0;
      for (let i = 0; i < this.regeressFrames.length; i++) {
        fps += this.regeressFrames[i];
      }

      fps = fps / this.regeressFrames.length;

      if (fps < 50) {
        // lower detail of noise in frag shader func
        if (this.experience.regressLevel === 3) {
          if (this.FBM_OCTAVES > 1) {
            this.FBM_OCTAVES -= 1;

            this.scene.remove(this.mesh);
            this.material.dispose();

            this.setMaterial();
            this.setInstance();
            console.log('Level 3 regression, FBM_OCTAVES:', this.FBM_OCTAVES);
          } else {
            this.experience.regressLevel += 1;
            console.log('Moving to regress level 4');
          }
        }
      }

      this.regeressFrames = [];
      this.lastRegressCheck = t;
    }

    requestAnimationFrame(() => this.regress());
  }

  setRegress() {
    this.lastRegressCheck = this.clock.current / 1000; // in seconds
    this.regeressFrames = [];

    requestAnimationFrame(() => this.regress());
  }

  setInstance() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setDebug() {
    this.debugFolder
      .addInput(this.debugParams, 'Color', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;

        this.uniforms.uColor.value.r = r / 255;
        this.uniforms.uColor.value.g = g / 255;
        this.uniforms.uColor.value.b = b / 255;
      });

    this.debugFolder
      .addInput(this.debugParams, 'CloudColor', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;

        this.uniforms.uCloudColor.value.r = r / 255;
        this.uniforms.uCloudColor.value.g = g / 255;
        this.uniforms.uCloudColor.value.b = b / 255;
      });
  }
}
