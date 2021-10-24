import { Cube } from '../core/primitives/Cube';

/**
 * Chest
 */
const chestMain = new Cube({
  position: [0, 2.7, -1.0],
  scale: [1.2, 1.2, 0.75],
  rotation: [15, 0, 0],
});

const chestMid = new Cube({
  position: [0, 0.075, 0.85],
  scale: [0.85, 1, 0.95],
});

const abdomen = new Cube({
  position: [0, 0.1, 1.075],
  scale: [0.6, 0.75, 1.2],
});

const collar = new Cube({
  position: [0, 0.15, -0.475],
  scale: [0.7, 0.7, 0.2],
});

chestMain.add(chestMid);
chestMain.add(collar);
chestMid.add(abdomen);

export { chestMain, chestMid, abdomen };
