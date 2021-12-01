import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from 'three';
import Experience from '..';
import vertexShader from '../../shaders/flames/vert.glsl';
import fragmentShader from '../../shaders/flames/frag.glsl';

export default class Flames {
  constructor(count = 10, radius = 20) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.clock = this.experience.clock;
    this.resources = this.experience.resources;
    this.count = count;
    this.radius = radius;
    this.FBM_OCTAVES = 5;

    this.setGeometry();
    this.setUniforms();
    this.setMaterial();
    this.setRegress();
    this.setInstance();

    if (this.experience.debug.active) {
      this.debug = this.experience.debug;
      this.debugParams = {
        FlameColor: {
          r: this.uniforms.uColor.value.r * 255,
          g: this.uniforms.uColor.value.g * 255,
          b: this.uniforms.uColor.value.b * 255,
        },
        FlameSize: this.uniforms.uSpriteSize.value,
      };
      this.debugFolder = this.debug.pane.addFolder({
        title: 'Flame Sprites',
        expanded: false,
      });

      this.setDebug();
    }

    return this;
  }

  setGeometry() {
    this.geometry = new BufferGeometry();

    let pts = [];

    for (let i = 0; i < this.count; i++) {
      let theta = Math.random() * Math.PI * 2;
      let radius = Math.random() * this.radius;

      let x = Math.cos(theta) * radius;
      let y = Math.random() * 3 + 5; // height is in [5,8]
      let z = Math.sin(theta) * radius;

      pts.push(x, y, z);
    }

    let atr = new BufferAttribute(new Float32Array(pts), 3, false);
    this.geometry.setAttribute('position', atr);
  }

  setUniforms() {
    this.uniforms = {
      uTime: { value: this.clock.elapsed },
      uColor: { value: new Color(1.0, 0.5765, 0.5765) },
      uPixelRatio: { value: this.experience.sizes.pixelRatio },
      uSpriteSize: { value: 45 },
    };

    this.experience.sizes.on('resize', () => {
      this.uniforms.uPixelRatio.value = this.experience.sizes.pixelRatio;
    });

    this.clock.on('tick', () => {
      this.uniforms.uTime.value = this.clock.elapsed;
    });
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
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
        if (this.experience.regressLevel === 2) {
          if (this.FBM_OCTAVES > 3) {
            this.FBM_OCTAVES -= 1;

            this.scene.remove(this.points);
            this.material.dispose();

            this.setMaterial();
            this.setInstance();
            console.log('Level 2 regression, FBM_OCTAVES:', this.FBM_OCTAVES);
          } else {
            this.experience.regressLevel += 1;
            console.log('Moving to regress level 3');
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
    this.points = new Points(this.geometry, this.material);

    this.scene.add(this.points);
  }

  setDebug() {
    this.debugFolder
      .addInput(this.debugParams, 'FlameColor', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;

        this.uniforms.uColor.value.r = r / 255;
        this.uniforms.uColor.value.g = g / 255;
        this.uniforms.uColor.value.b = b / 255;
      });

    this.debugFolder
      .addInput(this.debugParams, 'FlameSize', { step: 1, min: 10, max: 50 })
      .on('change', (e) => {
        this.uniforms.uSpriteSize.value = e.value;
      });
  }
}
