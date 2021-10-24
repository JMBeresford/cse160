import { Cube } from '../core/primitives/Cube';
import { Object3D } from '../core/Object3D';

const headJoint = new Object3D({
  position: [0, 0.5, 0],
  scale: [1, 1, 1],
  rotation: [0, 0, 0],
});

const jawJoint = new Object3D({
  position: [0, 0, 0],
  scale: [1, 1, 1],
  rotation: [-5, 0, 0],
});

const jaw = new Cube({
  position: [0, -0.025, -0.4],
  scale: [0.2, 0.05, 0.4],
});

const head = new Cube({
  position: [0, 0.2, 0],
  scale: [0.6, 0.4, 0.6],
});

const snout = new Cube({
  position: [0, -0.1, -0.45],
  scale: [0.3, 0.2, 0.3],
});

headJoint.add([jawJoint, head]);
jawJoint.add(jaw);
head.add(snout);

export { headJoint, jaw, head };
