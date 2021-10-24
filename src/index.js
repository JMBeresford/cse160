import './style.css';
import { Renderer } from './core/Renderer';
import { Plane } from './core/primitives/Plane';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import { Uniform } from './core/Object3D';
import { gsap, Power2 } from 'gsap';
import basicVertexShader from './core/shaders/basic/basic.vert';
import basicFragmentShader from './core/shaders/basic/basic.frag';
import giraffeVertextShader from './shaders/giraffe/giraffe.vert';
import giraffeFragmentShader from './shaders/giraffe/giraffe.frag';
import skyVertexShader from './shaders/sky/sky.vert';
import skyFragmentShader from './shaders/sky/sky.frag';
import floorVertexShader from './shaders/floor/floor.vert';
import floorFragmentShader from './shaders/floor/floor.frag';
import maneVertexShader from './shaders/mane/mane.vert';
import maneFragmentShader from './shaders/mane/mane.frag';
import tailVertexShader from './shaders/tail/tail.vert';
import tailFragmentShader from './shaders/tail/tail.frag';
import eyesVertexShader from './shaders/eyes/eyes.vert';
import eyesFragmentShader from './shaders/eyes/eyes.frag';

import * as Giraffe from './giraffe';
import { Sky } from './Sky';

// animations etc
var frame = null;
const tl = gsap.timeline();

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);

// camera
const camera = new PerspectiveCamera({
  position: [0, 5.5, -10],
  far: 40,
  target: [0, 3.5, 0],
});

// scene
const scene = new Scene({ position: [0, 0, 0], rotation: [0, -70, 0] });

/**
 * Floor
 */
const floor = new Plane({
  position: [0, 0, 0],
  scale: [25, 25, 0],
  widthSegments: 1,
  heightSegments: 1,
  rotation: [90, 0, 0],
});

floor.transparent = true;

floor.setShaderProgram(renderer.gl, floorVertexShader, floorFragmentShader);

/**
 * Giraffe
 */

// kinda gross way to compile shaders, but need ref to the gl context to do so
// will figure out way to do this declaratively in class instances later
Giraffe.Mane.setShaderProgram(
  renderer.gl,
  maneVertexShader,
  maneFragmentShader
);

Giraffe.Tail.setShaderProgram(
  renderer.gl,
  tailVertexShader,
  tailFragmentShader
);

Giraffe.eyes.setShaderProgram(
  renderer.gl,
  eyesVertexShader,
  eyesFragmentShader
);

Giraffe.chestMain.traverse((obj) => {
  if (obj.type !== 'cube') return;

  if (obj.userData.hoof) {
    obj.setShaderProgram(renderer.gl, basicVertexShader, basicFragmentShader);
    obj.setColor(0.1, 0.1, 0.1);
  } else if (obj.userData.antler) {
    obj.setShaderProgram(renderer.gl, basicVertexShader, basicFragmentShader);
    obj.setColor(0.1647, 0.2353, 0.4078);
  } else {
    obj.setShaderProgram(
      renderer.gl,
      giraffeVertextShader,
      giraffeFragmentShader
    );
    obj.setColor(0.749, 0.8196, 1.0);
  }
});

/**
 * Sky
 */
Sky.traverse((obj) => {
  if (obj.type !== 'plane') return;
  obj.setShaderProgram(renderer.gl, skyVertexShader, skyFragmentShader);
  obj.uniforms.uColor.value.set([0, 0.0353, 0.0588]);
  obj.uniforms.uColor2 = new Uniform([0, 0.08235, 0.1412], 3, 'vec3');
  obj.uniforms.uColor3 = new Uniform([1, 0.6196, 0.6196], 3, 'vec3');
  obj.uniforms.uColor4 = new Uniform([0, 0.0549, 0.1412], 3, 'vec3');

  obj.uniforms.uRotation = new Uniform([0], 1, 'float');
});

scene.add([floor, Sky, Giraffe.chestMain]);

/**
 * Animations Config
 */
const startAnimations = (tl) => {
  const rotationAngles = {
    leftKnee: -45,
    leftLegJoint: 25,
    neckJoint: -5,
    neckJoint1: -12,
  };

  tl.to(rotationAngles, {
    leftLegJoint: 30,
    ease: Power2.easeInOut,
    duration: 3,
    repeat: -1,
    yoyo: true,
    onUpdate: () => {
      Giraffe.leftLegJoint.setRotation(rotationAngles.leftLegJoint, 0, 0);
    },
  });

  tl.to(rotationAngles, {
    leftKnee: -30,
    delay: -2,
    ease: Power2.easeInOut,
    duration: 3,
    repeat: -1,
    yoyo: true,
    onUpdate: () => {
      Giraffe.leftKnee.setRotation(rotationAngles.leftKnee, 0, 0);
    },
  });

  tl.to(rotationAngles, {
    neckJoint: -8,
    ease: Power2.easeInOut,
    delay: -3,
    duration: 5,
    repeat: -1,
    yoyo: true,
    onUpdate: () => {
      Giraffe.neckJoint.setRotation(rotationAngles.neckJoint, 0, 0);
    },
  });

  tl.to(rotationAngles, {
    neckJoint1: -15,
    ease: Power2.easeInOut,
    delay: -2,
    duration: 5,
    repeat: -1,
    yoyo: true,
    onUpdate: () => {
      Giraffe.neckJoint1.setRotation(rotationAngles.neckJoint1, 0, 0);
    },
  });
};

/**
 * DEBUG
 */
const monitor = new Monitor(0);
const pane = new Pane({ title: 'Config', expanded: true });

const PARAMS = {
  scene: {
    animations: true,
  },
  chestMain: {
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
  },
  rightFrontLeg: {
    legRotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    kneeRotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
};

const scenef = pane.addFolder({ title: 'Scene' });
const cubef = pane.addFolder({ title: 'Cube' });
const rlegf = pane.addFolder({ title: 'Right Leg' });

scenef.addInput(PARAMS.scene, 'animations').on('change', (e) => {
  if (e.value == true) {
    tl.resume();
  } else {
    tl.pause();
  }
});

cubef.addInput(PARAMS.chestMain, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  Giraffe.chestMain.setPosition(x, y, z);
});

cubef.addInput(PARAMS.chestMain, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  Giraffe.chestMain.setRotation(x, y, z);
});

rlegf.addInput(PARAMS.rightFrontLeg, 'legRotation').on('change', (e) => {
  let { x, y, z } = e.value;

  rightLegJoint.setRotation(x, y, z);
});

rlegf.addInput(PARAMS.rightFrontLeg, 'kneeRotation').on('change', (e) => {
  let { x, y, z } = e.value;

  rightKnee.setRotation(x, y, z);
});

canvas.onclick = () => {
  // console.log(Giraffe.chestMain);
};

/**
 *  render loop and clock
 */
const clock = new Date();

const tick = () => {
  monitor.begin();

  if (PARAMS.scene.animations) {
    // the following is gross, will implement a proper clock
    // and apply the timing to every object in scene traversal if i have time
    Giraffe.chestMain.traverse((obj) => {
      if (obj.type !== 'cube' || obj.userData.hoof) return;

      obj.uniforms.uTime.value[0] = (clock.getTime() / 10000) % 1000;
    });

    Sky.traverse((obj) => {
      if (obj.type !== 'plane') return;

      obj.uniforms.uTime.value[0] = (clock.getTime() / 500) % 1000;
    });

    Giraffe.Mane.uniforms.uTime.value[0] = (clock.getTime() / 10000) % 1000;
    Giraffe.Tail.uniforms.uTime.value[0] = (clock.getTime() / 10000) % 1000;
    Giraffe.eyes.uniforms.uTime.value[0] = (clock.getTime() / 10000) % 1000;

    floor.uniforms.uTime.value[0] = (clock.getTime() / 10000) % 1000;
  }

  renderer.render(scene, camera);
  let [, y] = scene.getRotation();

  Sky.traverse((obj) => {
    if (obj.uniforms.uRotation && obj.uniforms.uRotation.value) {
      obj.uniforms.uRotation.value[0] = (Math.PI * y) / 180;
    }
  });
  clock.setTime(Date.now());
  monitor.end();

  frame = requestAnimationFrame(tick);
};

/**
 * Scene rotation events
 */
const mouse = {
  x: 0,
  y: 0,
};

canvas.onmousedown = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

canvas.onmousemove = (e) => {
  if (e.buttons !== 1) return;

  let [x, y, z] = scene.getRotation();

  let dx = (mouse.x - e.clientX) / 10;
  let dy = (mouse.y - e.clientY) / 10; // restricting vertical view for now

  scene.setRotation(x + dy, y - dx, z);
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

/**
 * Begin render loop
 */
startAnimations(tl);
tick();

document.querySelector('.name').classList.add('in');
document.querySelector('.drag-tip').classList.add('in');
