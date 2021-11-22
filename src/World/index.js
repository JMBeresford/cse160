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

const World = new Object3D();

World.floor = Floor;

const frontSky = new Plane(64, 64);
frontSky.setPosition(0, 32, 32);
frontSky.setRotation(0, 180, 0);
frontSky.vertexShader = frontSkyVertexShader;
frontSky.fragmentShader = frontSkyFragmentShader;
frontSky.transparent = false;
frontSky.depthTest = false;

const backSky = new Plane(64, 64);
backSky.setPosition(0, 32, -32);
backSky.setRotation(0, 0, 0);
backSky.vertexShader = backSkyVertexShader;
backSky.fragmentShader = backSkyFragmentShader;
backSky.transparent = false;
backSky.depthTest = false;

const leftSky = new Plane(64, 64);
leftSky.setPosition(32, 32, 0);
leftSky.setRotation(0, -90, 0);
leftSky.vertexShader = skyVertexShader;
leftSky.fragmentShader = skyFragmentShader;
leftSky.transparent = false;
leftSky.depthTest = false;

const rightSky = new Plane(64, 64);
rightSky.setPosition(-32, 32, 0);
rightSky.setRotation(0, 90, 0);
rightSky.vertexShader = skyVertexShader;
rightSky.fragmentShader = skyFragmentShader;
rightSky.transparent = false;
rightSky.depthTest = false;

const topSky = new Plane(64, 64);
topSky.setPosition(0, 64, 0);
topSky.setRotation(90, 0, 0);
topSky.vertexShader = topSkyVertexShader;
topSky.fragmentShader = topSkyFragmentShader;
topSky.transparent = false;
topSky.depthTest = false;

World.add([Floor, frontSky, leftSky, rightSky, backSky, topSky]);

export { World };
