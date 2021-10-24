import { Object3D } from './core/Object3D';
import { Plane } from './core/primitives/Plane';

const Sky = new Object3D({
  position: [0, 0, 0],
  scale: [1, 1, 1],
});

const backWall = new Plane({
  position: [0, 0, 12.5],
  scale: [25, 50, 0],
  rotation: [0, 0, 0],
});

const leftWall = new Plane({
  position: [12.5, 0, 0],
  scale: [25, 50, 0],
  rotation: [0, 90, 0],
});

const rightWall = new Plane({
  position: [-12.5, 0, 0],
  scale: [25, 50, 0],
  rotation: [0, -90, 0],
});

const frontWall = new Plane({
  position: [0, 0, -12.5],
  scale: [25, 50, 0],
  rotation: [0, 0, 0],
});

const topWall = new Plane({
  position: [0, 12.5, 0],
  scale: [25, 25, 0],
  rotation: [90, 0, 0],
});

Sky.transparent = true;

Sky.add([backWall, leftWall, rightWall, frontWall, topWall]);

export { Sky, backWall };
