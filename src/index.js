import './style.css';
import { Renderer } from './core/Renderer';
import { World } from './World';
import { Sphere } from './core/primitives/Sphere';
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
import { SpotLight } from './core/lights/SpotLight';
import { PointLight } from './core/lights/PointLight';
import { AmbientLight } from './core/lights/AmbientLight';
import normalVertexShader from './core/shaders/normal/normal.vert';
import normalFragmentShader from './core/shaders/normal/normal.frag';
import rockVertexShader from './shaders/Rock/rock.vert';
import rockFragmentShader from './shaders/Rock/rock.frag';
import floorVertexShader from './shaders/Floor/floor.vert';
import floorFragmentShader from './shaders/Floor/floor.frag';

var _v1 = new Vector3();
const _y = new CANNON.Vec3(0, 1, 0);
var _v1Cannon = new CANNON.Vec3();

// set up renderer
const canvas = document.querySelector('#webgl');
const renderer = new Renderer(canvas);
renderer.setClearColor(0.0588, 0.0314, 0.1059, 1.0);
// camera
const camera = new PerspectiveCamera([0, 2, 0], [0, 1.5, 4]);

// lights
const Light1 = new SpotLight([0, 2, -3]);
Light1.setColor(0.1, 0.2, 0.75);
Light1.visible = true;

const ambientLight = new AmbientLight();
ambientLight.intensity = 0.5;

const Sun1 = new PointLight([5, 8, 5]);
Sun1.setColor(1.0, 0.7765, 0.7765);
Sun1.visible = true;

// scene
const scene = new Scene();
const piles = [];

for (let i = 0; i < 6; i++) {
  let x = Math.random() * 8.0 + 4.0;
  if (Math.random() > 0.5) x *= -1;

  let z = Math.random() * 8.0 + 4.0;
  if (Math.random() > 0.5) z *= -1;

  let p = new Pile(
    Math.floor(Math.random() * 3.0 + 3),
    [x, 0, z],
    [0, Math.random() * 90, 0]
  );
  piles.push(p);
  scene.add(p);
}

const sphere = new Sphere(1, 20, 20);
sphere.setPosition(0, 1.5, 4);
sphere.setColor(0.5, 0.5, 0.5);

scene.add([World, Light1, Sun1, ambientLight, sphere]);

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
    friction: 1.0,
    restitution: 0,
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

const camShape = new CANNON.Box(new CANNON.Vec3(0.5, 3.5, 1.0));
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
    normals: false,
  },
  sphere: {
    color: { r: 255 / 2, g: 255 / 2, b: 255 / 2 },
    position: { x: 0, y: 1.5, z: 4 },
  },
  ambientLight: {
    color: { r: 255, g: 255, b: 255 },
    intensity: 0.5,
    on: true,
  },
  pointLight: {
    color: { r: 255, g: 198, b: 198 },
    position: { x: 0, y: 0, z: 0 },
    intensity: 1,
    specularExponent: 30,
    on: true,
    autoRotate: true,
  },
  spotLight: {
    color: { r: 25.1, g: 55, b: 191.25 },
    target: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 2, z: -3 },
    intensity: 1,
    angle: 15,
    on: true,
  },
};

const state = {
  ambient: { r: 255, g: 255, b: 255 },
  point: { r: 255, g: 198, b: 198 },
  spot: { r: 25.1, g: 55, b: 191.25 },
  autoRotate: true,
};

const scenef = pane.addFolder({ title: 'Scene', expanded: false });
const spheref = pane.addFolder({ title: 'Sphere', expanded: false });
const lightsf = pane.addFolder({ title: 'Lights', expanded: false });
const ambientf = lightsf.addFolder({ title: 'Ambient Light', expanded: false });
const pointf = lightsf.addFolder({ title: 'Point Light', expanded: false });
const spotf = lightsf.addFolder({ title: 'Spot Light', expanded: false });

scenef.addInput(PARAMS.scene, 'rotation').on('change', (e) => {
  let { x, y, z } = e.value;

  scene.setRotation(x, y, z);
});

scenef.addInput(PARAMS.scene, 'normals').on('change', (e) => {
  if (e.value) {
    for (let pile of piles) {
      for (let rock of pile.children) {
        rock.setShaderProgram(
          renderer.gl,
          normalVertexShader,
          normalFragmentShader
        );
      }
    }

    sphere.setShaderProgram(
      renderer.gl,
      normalVertexShader,
      normalFragmentShader
    );

    World.floor.setShaderProgram(
      renderer.gl,
      normalVertexShader,
      normalFragmentShader
    );
  } else {
    for (let pile of piles) {
      for (let rock of pile.children) {
        rock.setShaderProgram(
          renderer.gl,
          rockVertexShader,
          rockFragmentShader
        );
      }
    }

    sphere.program = null;

    World.floor.setShaderProgram(
      renderer.gl,
      floorVertexShader,
      floorFragmentShader
    );
  }
});

spheref.addInput(PARAMS.sphere, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  sphere.setPosition(x, y, z);
});

spheref.addInput(PARAMS.sphere, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  sphere.setColor(r / 255, g / 255, b / 255);
});

ambientf.addInput(PARAMS.ambientLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  state.ambient = { r: r / 255, g: g / 255, b: b / 255 };

  if (PARAMS.ambientLight.on) {
    ambientLight.setColor(r / 255, g / 255, b / 255);
  }
});

ambientf.addInput(PARAMS.ambientLight, 'intensity').on('change', (e) => {
  ambientLight.intensity = e.value;
});

ambientf.addInput(PARAMS.ambientLight, 'on').on('change', (e) => {
  if (e.value) {
    let { r, g, b } = state.ambient;

    ambientLight.setColor(r, g, b);
  } else {
    ambientLight.setColor(0, 0, 0);
  }
});

pointf.addInput(PARAMS.pointLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  state.point = { r: r / 255, g: g / 255, b: b / 255 };

  if (PARAMS.pointLight.on) {
    Sun1.setColor(r / 255, g / 255, b / 255);
  }
});

let sunPos = pointf
  .addInput(PARAMS.spotLight, 'position', { hidden: true })
  .on('change', (e) => {
    let { x, y, z } = e.value;

    Sun1.setPosition(x, y, z);
  });

pointf.addInput(PARAMS.pointLight, 'intensity').on('change', (e) => {
  Sun1.intensity = e.value;
});

pointf.addInput(PARAMS.pointLight, 'specularExponent').on('change', (e) => {
  Sun1.specularExponent = e.value;
});

pointf.addInput(PARAMS.pointLight, 'autoRotate').on('change', (e) => {
  if (e.value) {
    sunPos.hidden = true;
    state.autoRotate = true;
  } else {
    sunPos.hidden = false;
    state.autoRotate = false;
  }
});

pointf.addInput(PARAMS.pointLight, 'on').on('change', (e) => {
  if (e.value) {
    let { r, g, b } = state.point;

    Sun1.setColor(r, g, b);
  } else {
    Sun1.setColor(0, 0, 0);
  }
});

spotf.addInput(PARAMS.spotLight, 'color').on('change', (e) => {
  let { r, g, b } = e.value;

  state.spot = { r: r / 255, g: g / 255, b: b / 255 };

  if (PARAMS.spotLight.on) {
    Light1.setColor(r / 255, g / 255, b / 255);
  }
});

spotf.addInput(PARAMS.spotLight, 'target').on('change', (e) => {
  let { x, y, z } = e.value;

  Light1.target = [x, y, z];
});

spotf.addInput(PARAMS.spotLight, 'position').on('change', (e) => {
  let { x, y, z } = e.value;

  Light1.setPosition(x, y, z);
});

spotf.addInput(PARAMS.spotLight, 'intensity').on('change', (e) => {
  Light1.intensity = e.value;
});

spotf.addInput(PARAMS.spotLight, 'angle').on('change', (e) => {
  Light1.cutoffAngle = e.value;
});

spotf.addInput(PARAMS.spotLight, 'on').on('change', (e) => {
  if (e.value) {
    let { r, g, b } = state.spot;

    Light1.setColor(r, g, b);
  } else {
    Light1.setColor(0, 0, 0);
  }
});

const controls = new Controls(camera, renderer.gl.canvas, World, camBody);
const clock = { time: Date.now(), delta: 0 };

const tick = () => {
  monitor.begin();
  clock.delta = Date.now() - clock.time;
  clock.time = Date.now();

  if (state.autoRotate) {
    Sun1.setPosition(
      10 * Math.cos(clock.time * 0.0005),
      3,
      10 * Math.sin(clock.time * 0.0005)
    );
  }

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
      rock.uniforms['uCamPos'].value = camera.getPosition();
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
