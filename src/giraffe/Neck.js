import { Object3D } from '../core/Object3D';
import { Cube } from '../core/primitives/Cube';

const neckJoint = new Object3D({
  position: [0, 0.6, -0.2],
  scale: [1, 1, 1],
  rotation: [-5, 0, 0],
});
neckJoint.visible = false;

const neckBase = new Cube({
  position: [0, 0.2, 0],
  scale: [0.8, 0.6, 0.8],
});

const neckLow = new Cube({
  position: [0, 0.8, 0],
  scale: [0.75, 1, 0.75],
});

const neckJoint1 = new Object3D({
  position: [0, 0.5, 0],
  scale: [1, 1, 1],
  rotation: [-12, 0, 0],
});
neckJoint1.visible = false;

const neckMid = new Cube({
  position: [0, 0.6, 0],
  scale: [0.6, 1.2, 0.6],
});

const neckJoint2 = new Object3D({
  position: [0, 0.6, 0],
  scale: [1, 1, 1],
  rotation: [-5, 0, 0],
});
neckJoint2.visible = false;

const neckHigh = new Cube({
  position: [0, 0.5, 0],
  scale: [0.4, 1, 0.4],
});

neckJoint.add(neckBase);
neckBase.add(neckLow);
neckLow.add(neckJoint1);
neckJoint1.add(neckMid);
neckMid.add(neckJoint2);
neckJoint2.add(neckHigh);

export { neckJoint, neckHigh, neckJoint1, neckJoint2, neckMid };
