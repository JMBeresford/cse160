import { Plane } from '../core/primitives/Plane';
import vertexShader from '../shaders/Floor/floor.vert';
import fragmentShader from '../shaders/Floor/floor.frag';

// floor
const Floor = new Plane(64, 64, 64, 64);
Floor.setRotation(-90, 0, 0);

Floor.vertexShader = vertexShader;
Floor.fragmentShader = fragmentShader;

export { Floor };
