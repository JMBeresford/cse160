import './style.css';
import { Renderer } from './core/Renderer';
import { World } from './World';
import { PerspectiveCamera } from './core/Cameras';
import { Scene } from './core/Scene';
import { Monitor } from './core/debug/stats';
import { Pane } from 'tweakpane';
import { Controls } from './Controls';
import { Pile } from './Pile';
import * as CANNON from 'cannon';
import { Vector3 } from '../lib/cuon-matrix-cse160';
import rockImg from './img/rock.jpg';
import { Uniform } from './core/Object3D';

var _v1 = new Vector3();
const _y = new CANNON.Vec3(0, 1, 0);
var _v1Cannon = new CANNON.Vec3();
var _q1 = new CANNON.Quaternion();

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);
renderer.setClearColor(0.0588, 0.0314, 0.1059, 1.0);
// camera
const camera = new PerspectiveCamera({
  position: [0, 2, 0],
  target: [0, 1.5, 4],
});

// scene
const scene = new Scene({ position: [0, 0, 0] });
const piles = [];

for (let i = 0; i < 6; i++) {
  let x = Math.random() * 8.0 + 4.0;
  if (Math.random() > 0.5) x *= -1;

  let z = Math.random() * 8.0 + 4.0;
  if (Math.random() > 0.5) z *= -1;

  let p = new Pile({
    amount: Math.floor(Math.random() * 3.0 + 3),
    position: [x, 0, z],
    rotation: [0, Math.random() * 90, 0],
  });
  piles.push(p);
  scene.add(p);
}

scene.add([World]);

/**
 * PHYSICS
 */

const physics = new CANNON.World();
// physics.broadphase = new CANNON.SAPBroadphase(physics);
physics.gravity.set(0, -9.82, 0);

const rockMaterial = new CANNON.Material('rock');
const sandMaterial = new CANNON.Material('sand');

const rockSandContactMaterial = new CANNON.ContactMaterial(
  rockMaterial,
  sandMaterial,
  {
    friction: 0.8,
    restitution: 0.01,
  }
);

const rockRockContactMaterial = new CANNON.ContactMaterial(
  rockMaterial,
  rockMaterial,
  {
    friction: 0.9,
    restitution: 0.1,
  }
);

physics.addContactMaterial(rockSandContactMaterial);
physics.addContactMaterial(rockRockContactMaterial);

const groundBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 0, 0),
  material: sandMaterial,
});
const groundShape = new CANNON.Plane();
groundBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
);

const camBody = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, 2, -3),
  material: rockMaterial,
});

const camShape = new CANNON.Box(new CANNON.Vec3(0.5, 2.5, 1.0));
camBody.addShape(camShape);

groundBody.addShape(groundShape);
physics.addBody(groundBody);
physics.addBody(camBody);

for (let pile of piles) {
  for (let rock of pile.children) {
    let [x, y, z] = rock.getScale();
    let [px, py, pz] = rock.getWorldPosition();

    rock.userData.body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(px, py, pz),
      material: rockMaterial,
    });

    rock.userData.shape = new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2));

    rock.userData.body.addShape(rock.userData.shape);
    physics.addBody(rock.userData.body);
  }
}

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

const controls = new Controls(camera, renderer.gl.canvas, World, camBody);
const clock = { time: Date.now(), delta: 0 };

const tick = () => {
  monitor.begin();
  clock.delta = Date.now() - clock.time;
  clock.time = Date.now();

  for (let child of World.children) {
    child.uniforms.uTime.value[0] += clock.delta * 0.05;
  }

  physics.step(1.0 / 60.0, clock.delta / 1000, 3);
  camBody.position.set(...camera.getPosition());
  let [, ry] = camera.getRotation();
  camBody.quaternion.setFromAxisAngle(_y, ((ry % 360) * Math.PI) / 180);
  for (let pile of piles) {
    for (let rock of pile.children) {
      _v1.set(rock.userData.body.position.toArray()).sub(rock.parent.position);
      rock.setPosition(..._v1.elements);
      rock.userData.body.quaternion.toEuler(_v1Cannon);
      let [rx, ry, rz] = _v1Cannon.toArray();
      rock.setRotation(
        (rx * 180) / Math.PI,
        (ry * 180) / Math.PI,
        (rz * 180) / Math.PI
      );
      rock.uniforms['uCameraPos'].value = camera.getPosition();
    }
  }
  controls.update();
  renderer.render(scene, camera);

  monitor.end();

  requestAnimationFrame(tick);
};

/**
 * TEXTURE
 */

const loadTexture = (gl, path, piles) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const pixel = new Uint8Array([30, 30, 30, 255]);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel
  );

  const img = new Image();

  img.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    for (let pile of piles) {
      for (let rock of pile.children) {
        rock.uniforms['uTexture'] = new Uniform([0], 1, 'int');
        rock.image = img;
        rock.texture = texture;
      }
    }

    tick();
  };

  img.src = path;
};

loadTexture(renderer.gl, rockImg, piles);
