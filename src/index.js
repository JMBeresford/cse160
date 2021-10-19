import './style.css';
import { Renderer } from './core/Renderer';
import { Cube } from './core/primitives/Cube';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import basicVertexShader from './core/shaders/basic/basic.vert';
import basicFragmentShader from './core/shaders/basic/basic.frag';

var frame = null;

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);

// camera
const camera = new PerspectiveCamera({ position: [0, 0.5, -3] });

// scene
const scene = new Scene({ position: [0, 0, 0] });

const cube = new Cube({ position: [0, 0, 0], scale: [1, 1, 1] });
const floor = new Cube({ position: [0, -3, 0], scale: [25, 0, 25] });

floor.setVertexShader(basicVertexShader);
floor.setFragmentShader(basicFragmentShader);

floor.setColor([0.75, 0.75, 0.75]);

scene.add([cube, floor]);

// DEBUG TOOLS
const monitor = new Monitor(0);
const pane = new Pane({ title: 'Config', expanded: false });

const PARAMS = {
  scene: {
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  cube: {
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    autoRotate: false,
  },
};

const scenef = pane.addFolder({ title: 'Scene' });
const cubef = pane.addFolder({ title: 'Cube' });

scenef.addInput(PARAMS.scene, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  scene.setRotation(x, y, z);
});

cubef.addInput(PARAMS.cube, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  cube.setPosition(x, y, z);
});

cubef.addInput(PARAMS.cube, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  cube.setRotation(x, y, z);
});

cubef.addInput(PARAMS.cube, 'autoRotate').on('change', (e) => {
  PARAMS.cube.autoRotate = e.value;
});

const tick = () => {
  monitor.begin();
  if (PARAMS.cube.autoRotate) {
    let [x, y, z] = cube.getRotation();
    cube.setRotation((x += 0.1), y, z);
  }

  renderer.render(scene, camera);
  monitor.end();

  frame = requestAnimationFrame(tick);
};

canvas.addEventListener('click', (e) => {
  console.log(cube);
});

tick();
