import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import Experience from '.';
import vertexShader from '../shaders/loading/vert.glsl';
import fragmentShader from '../shaders/loading/frag.glsl';
import { gsap, Power2 } from 'gsap';
import World from './World';

export default class Loading {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setUniforms();
    this.setMaterial();
    this.setInstance();

    return this;
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(2, 2);
  }

  setUniforms() {
    this.uniforms = {
      uEnter: { value: 1 },
    };
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    });
  }

  setInstance() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.dom = document.getElementById('landing');
    this.button = document.getElementById('enterBtn');

    this.resources.on('ready', () => {
      this.button.classList.add('ready');
      this.button.textContent = 'Enter';
      this.button.onclick = () => {
        this.load();
        this.dom.classList.add('out');
      };
    });

    this.scene.add(this.mesh);
  }

  load() {
    this.experience.world.load();
    gsap.to(this.uniforms.uEnter, {
      duration: 3,
      ease: Power2.easeIn,
      value: 0,
      onUpdate: () => {
        this.material.uniformsNeedUpdate = true;
      },
      onComplete: () => {
        this.scene.remove(this.mesh);
        this.material.dispose();
        this.geometry.dispose();
      },
    });
  }
}
