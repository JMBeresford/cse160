import { Floor } from './Floor';
import { Plane } from '../core/primitives/Plane';
import { Object3D, Uniform } from '../core/Object3D';
import skyVertexShader from '../shaders/sky/sky.vert';
import skyFragmentShader from '../shaders/sky/sky.frag';
import frontSkyVertexShader from '../shaders/sky/frontSky.vert';
import frontSkyFragmentShader from '../shaders/sky/frontSky.frag';
import topSkyVertexShader from '../shaders/sky/topSky.vert';
import topSkyFragmentShader from '../shaders/sky/topSky.frag';
import backSkyVertexShader from '../shaders/sky/backSky.vert';
import backSkyFragmentShader from '../shaders/sky/backSky.frag';

const World = new Object3D({ position: [0, 0, 0] });

// for calculating fog
Floor.uniforms['uCameraPos'] = new Uniform(null, 3, 'vec3');
World.floor = Floor;

const frontSky = new Plane({
  position: [0, 32, 32],
  rotation: [0, 180, 0],
  width: 64,
  height: 64,
});
frontSky.vertexShader = frontSkyVertexShader;
frontSky.fragmentShader = frontSkyFragmentShader;
frontSky.transparent = false;

const backSky = new Plane({
  position: [0, 32, -32],
  rotation: [0, 180, 0],
  width: 64,
  height: 64,
});
backSky.vertexShader = backSkyVertexShader;
backSky.fragmentShader = backSkyFragmentShader;
backSky.transparent = false;

const leftSky = new Plane({
  position: [32, 32, 0],
  rotation: [0, -90, 0],
  width: 64,
  height: 64,
});
leftSky.vertexShader = skyVertexShader;
leftSky.fragmentShader = skyFragmentShader;
leftSky.transparent = false;

const rightSky = new Plane({
  position: [-32, 32, 0],
  rotation: [0, 90, 0],
  width: 64,
  height: 64,
});
rightSky.vertexShader = skyVertexShader;
rightSky.fragmentShader = skyFragmentShader;
rightSky.transparent = false;

const topSky = new Plane({
  position: [0, 64, 0],
  rotation: [90, 0, 0],
  width: 64,
  height: 64,
});
topSky.vertexShader = topSkyVertexShader;
topSky.fragmentShader = topSkyFragmentShader;
topSky.transparent = false;

World.add([Floor, frontSky, leftSky, rightSky, backSky, topSky]);

export { World };
