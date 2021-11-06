import { Plane } from '../core/primitives/Plane';
import vertexShader from '../shaders/Floor/floor.vert';
import fragmentShader from '../shaders/Floor/floor.frag';

// floor
const Floor = new Plane({
  position: [0, 0, 0],
  rotation: [90, 0, 0],
  width: 64,
  height: 64,
  widthSegments: 64,
  heightSegments: 64,
});

Floor.vertexShader = vertexShader;
Floor.fragmentShader = fragmentShader;

export { Floor };
