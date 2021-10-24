import { Cube } from '../core/primitives/Cube';
import { Object3D } from '../core/Object3D';

const MAX_BRANCHES = 4;
const ANGLE = 90;

const rand = () => {
  return Math.random() * ANGLE - ANGLE * 0.5;
};

const createBranch = (parentBranch, level = 0) => {
  if (level > MAX_BRANCHES) return;

  let [px, py, pz] = parentBranch.getScale();

  let newScale = [px * 0.85, py * 0.95, pz * 0.85];

  let leftJoint = new Object3D({
    position: [0, py * 0.5, 0],
    scale: [1, 1, 1],
    rotation: [rand(), rand(), -25],
  });

  let left = new Cube({
    position: [0, newScale[1] * 0.5, 0],
    scale: newScale,
  });

  let rightJoint = new Object3D({
    position: [0, py * 0.5, 0],
    scale: [1, 1, 1],
    rotation: [rand(), rand(), 25],
  });

  let right = new Cube({
    position: [0, newScale[1] * 0.5, 0],
    scale: newScale,
  });

  parentBranch.add([leftJoint, rightJoint]);
  leftJoint.add(left);
  rightJoint.add(right);

  left.userData['antler'] = true;
  right.userData['antler'] = true;

  createBranch(left, ++level);
  createBranch(right, ++level);
};

const antlersJoint1 = new Object3D({
  position: [0.15, 0.2, 0],
  scale: [1, 1, 1],
  rotation: [Math.random() * 15 - 15 / 2, Math.random() * 15 - 15 / 2, -10],
});

const antlersJoint2 = new Object3D({
  position: [-0.15, 0.2, 0],
  scale: [1, 1, 1],
  rotation: [Math.random() * 15 - 15 / 2, Math.random() * 15 - 15 / 2, 10],
});

const baseAntler1 = new Cube({
  position: [0, 0.2, 0],
  scale: [0.1, 0.4, 0.1],
});

baseAntler1.userData['antler'] = true;

const baseAntler2 = new Cube({
  position: [0, 0.2, 0],
  scale: [0.1, 0.4, 0.1],
});

baseAntler2.userData['antler'] = true;

createBranch(baseAntler1);
createBranch(baseAntler2);

antlersJoint1.add(baseAntler1);
antlersJoint2.add(baseAntler2);

export { antlersJoint1, antlersJoint2 };
