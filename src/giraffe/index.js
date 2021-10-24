import {
  leftLegJoint,
  rightLegJoint,
  leftRearLegJoint,
  rightRearLegJoint,
  leftKnee,
  rightKnee,
} from './Legs';
import { chestMain, abdomen } from './Torso';
import { neckJoint, neckHigh, neckJoint2, neckJoint1, neckMid } from './Neck';
import { headJoint, head } from './Head';
import { Mane, Tail } from './Mane';
import { antlersJoint1, antlersJoint2 } from './Antlers';
import { eyes } from './Eyes';

chestMain.add([leftLegJoint, rightLegJoint, neckJoint]);
abdomen.add([leftRearLegJoint, rightRearLegJoint, Tail]);
neckHigh.add(headJoint);
neckMid.add(Mane);
head.add([antlersJoint1, antlersJoint2, eyes]);

export {
  leftLegJoint,
  rightLegJoint,
  leftRearLegJoint,
  rightRearLegJoint,
  leftKnee,
  rightKnee,
  neckJoint,
  neckHigh,
  neckJoint2,
  neckJoint1,
  neckMid,
  headJoint,
  Mane,
  Tail,
  chestMain,
  abdomen,
  eyes,
};
