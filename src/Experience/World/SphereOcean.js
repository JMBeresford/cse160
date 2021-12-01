import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  Points,
  ShaderMaterial,
  SphereGeometry,
  SpotLight,
} from 'three';

import Experience from '..';
import vertexShader from '../../shaders/sphere/vert.glsl';
import fragmentShader from '../../shaders/sphere/frag.glsl';
import pointsVertexShader from '../../shaders/points/vert.glsl';
import pointsFragmentShader from '../../shaders/points/frag.glsl';

let dummy = new Object3D();

export default class SphereOcean {
  constructor(radius = 0.5, count = 75, sphereResolution = 20) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.clock = this.experience.clock;
    this.radius = radius;
    this.count = count;
    this.sphereResolution = sphereResolution;
    this.FBM_OCTAVES = 8;

    this.setUniforms();
    this.setGeometry();
    this.setMaterial();
    this.setPoints();
    this.setRegress();
    this.setLighting();
    this.setInstance();

    if (this.experience.debug.active) {
      this.debug = this.experience.debug;
      this.debugFolder = this.debug.pane.addFolder({
        title: 'Sphere Ocean',
        expanded: false,
      });

      this.debugParams = {
        DarkColor: {
          r: this.uniforms.uDarkColor.value.r * 255,
          g: this.uniforms.uDarkColor.value.g * 255,
          b: this.uniforms.uDarkColor.value.b * 255,
        },
        LightColor: {
          r: this.uniforms.uLightColor.value.r * 255,
          g: this.uniforms.uLightColor.value.g * 255,
          b: this.uniforms.uLightColor.value.b * 255,
        },
        HighlightColor: {
          r: this.uniforms.uHighlightColor.value.r * 255,
          g: this.uniforms.uHighlightColor.value.g * 255,
          b: this.uniforms.uHighlightColor.value.b * 255,
        },
      };

      this.setDebug();
    }

    this.clock.on('tick', () => {
      this.uniforms.uTime.value = this.clock.elapsed;
    });

    return this;
  }

  setUniforms() {
    this.uniforms = {
      uTime: { value: this.clock.elapsed },
      uDarkColor: { value: new Color('#000000') },
      uLightColor: {
        value: new Color('#ff2461'),
      },
      uHighlightColor: { value: new Color('#f5c2d0') },
      uFogColor: { value: new Color('#151111') },
      uPixelRatio: { value: this.experience.sizes.pixelRatio },
      uFBMOctaves: { value: 8 },
    };

    this.experience.sizes.on('resize', () => {
      this.uniforms.uPixelRatio.value = this.experience.sizes.pixelRatio;
    });
  }

  setGeometry() {
    this.geometry = new SphereGeometry(
      this.radius,
      this.sphereResolution,
      this.sphereResolution
    );

    let instanceId = [];

    for (let row = 0; row < this.count; row++) {
      for (let col = 0; col < this.count; col++) {
        instanceId.push(row, col);
      }
    }

    let atr = new InstancedBufferAttribute(
      new Float32Array(instanceId),
      2,
      false,
      1
    );
    this.geometry.setAttribute('aInstanceId', atr);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      defines: {
        FBM_OCTAVES: this.FBM_OCTAVES,
      },
    });
  }

  setPoints() {
    this.pointsGeometry = new BufferGeometry();

    let pos = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      let radius = Math.random() * 30.0;
      let theta = Math.random() * 180;

      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = radius * Math.sin(theta);
    }

    this.pointsGeometry.setAttribute(
      'position',
      new BufferAttribute(pos, 3, false)
    );

    this.pointsMaterial = new ShaderMaterial({
      vertexShader: pointsVertexShader,
      fragmentShader: pointsFragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    });

    this.points = new Points(this.pointsGeometry, this.pointsMaterial);
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
        if (this.experience.regressLevel === 0) {
          if (this.FBM_OCTAVES > 1) {
            this.FBM_OCTAVES -= 1;

            this.scene.remove(this.mesh);
            this.material.dispose();
            this.mesh.dispose();

            this.setMaterial();
            this.setInstance();
            console.log('Level 0 regression, FBM_OCTAVES:', this.FBM_OCTAVES);
          } else {
            this.experience.regressLevel += 1;
            console.log('Moving to regress level 1');
          }
        }

        if (this.experience.regressLevel === 1) {
          if (this.sphereResolution > 6) {
            this.sphereResolution -= 3;

            if (this.sphereResolution < 6) {
              this.sphereResolution = 6;
            }

            this.scene.remove(this.mesh);
            this.geometry.dispose();
            this.mesh.dispose();
            this.setGeometry();
            this.setInstance();

            console.log(
              'Level 1 regression, SphereResolution:',
              this.sphereResolution
            );
          } else {
            this.experience.regressLevel += 1;
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

  setLighting() {
    this.light = new SpotLight('#770005', 1000, 40);
    this.light.position.set(0, -20, 0);
    // this.lightHelper = new SpotLightHelper(this.light, 'white');

    this.ambientLight = new AmbientLight('#770005', 0.15);

    this.scene.add(this.light, this.ambientLight);
  }

  setInstance() {
    this.mesh = new InstancedMesh(
      this.geometry,
      this.material,
      Math.pow(this.count, 2)
    );

    let i = 0;
    const offset = (this.count - 1) / 2;

    for (let x = 0; x < this.count; x++) {
      for (let z = 0; z < this.count; z++) {
        dummy.position.set(
          (offset - x) * this.radius * 1.9,
          0,
          (offset - z) * this.radius * 1.9
        );
        dummy.rotation.x = Math.random() * Math.PI;
        dummy.rotation.y = Math.random() * Math.PI;
        dummy.rotation.z = Math.random() * Math.PI;

        dummy.updateMatrix();

        this.mesh.setMatrixAt(i++, dummy.matrix);
      }
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.rotateY(1.0);

    this.scene.add(this.mesh);
    this.scene.add(this.points);
  }

  setDebug() {
    this.debugFolder
      .addInput(this.debugParams, 'DarkColor', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;
        this.uniforms.uDarkColor.value.r = r / 255;
        this.uniforms.uDarkColor.value.g = g / 255;
        this.uniforms.uDarkColor.value.b = b / 255;
      });

    this.debugFolder
      .addInput(this.debugParams, 'LightColor', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;
        this.uniforms.uLightColor.value.r = r / 255;
        this.uniforms.uLightColor.value.g = g / 255;
        this.uniforms.uLightColor.value.b = b / 255;
      });

    this.debugFolder
      .addInput(this.debugParams, 'HighlightColor', { picker: 'inline' })
      .on('change', (e) => {
        let { r, g, b } = e.value;
        this.uniforms.uHighlightColor.value.r = r / 255;
        this.uniforms.uHighlightColor.value.g = g / 255;
        this.uniforms.uHighlightColor.value.b = b / 255;
      });
  }
}
