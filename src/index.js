import './style.css';
import { Renderer } from './core/Renderer';
import { World } from './World';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import { Controls } from './Controls';
import { Uniform } from './core/Object3D';

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);
renderer.setClearColor(0.0588, 0.0314, 0.1059, 1.0);
// camera
const camera = new PerspectiveCamera({
  position: [-3, 0.2, 0],
});

// scene
const scene = new Scene({ position: [0, 0, 0] });

scene.add([World]);

// DEBUG TOOLS
const monitor = new Monitor(0);
const pane = new Pane({ title: 'Config' });

const PARAMS = {
  scene: {
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
};

const scenef = pane.addFolder({ title: 'Scene' });

scenef.addInput(PARAMS.scene, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  scene.setRotation(x, y, z);
});

const controls = new Controls(camera, renderer.gl.canvas, World);
const clock = { time: Date.now(), delta: 0 };

const tick = () => {
  monitor.begin();
  clock.delta = Date.now() - clock.time;
  clock.time = Date.now();

  for (let child of World.children) {
    child.uniforms.uTime.value[0] += clock.delta * 0.05;
  }

  controls.update();
  renderer.render(scene, camera);

  monitor.end();

  requestAnimationFrame(tick);
};

tick();
