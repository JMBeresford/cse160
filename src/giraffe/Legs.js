import { Object3D } from '../core/Object3D';
import { Cube } from '../core/primitives/Cube';
import { gsap, Power2 } from 'gsap';

/**
 * Legs
 */

// FRONT
const leftLegJoint = new Object3D({
  position: [0, -0.5, 0],
  scale: [1, 1, 1],
  rotation: [25, 0, 0],
});
leftLegJoint.visible = false;

const leftFrontLeg = new Cube({
  position: [0.4, -0.6, 0],
  scale: [0.2, 1.2, 0.2],
});

const leftKnee = new Object3D({
  position: [0, -0.6, 0],
  scale: [1, 1, 1],
  rotation: [-45, 0, 0],
});
leftKnee.visible = false;

const leftFrontLegLower = new Cube({
  position: [0, -0.4, 0],
  scale: [0.175, 0.8, 0.175],
});

const leftFrontHoof = new Cube({
  position: [0, -0.475, 0],
  scale: [0.2, 0.15, 0.2],
});

leftFrontHoof.userData['hoof'] = true;

const rightLegJoint = new Object3D({
  position: [0, -0.5, 0],
  scale: [1, 1, 1],
});
rightLegJoint.visible = false;

const rightFrontLeg = new Cube({
  position: [-0.4, -0.6, 0],
  scale: [0.2, 1.2, 0.2],
});

const rightKnee = new Object3D({
  position: [0, -0.6, 0],
  scale: [1, 1, 1],
  rotation: [-12, 0, 0],
});
rightKnee.visible = false;

const rightFrontLegLower = new Cube({
  position: [0, -0.4, 0],
  scale: [0.175, 0.8, 0.175],
});

const rightFrontHoof = new Cube({
  position: [0, -0.475, 0],
  scale: [0.2, 0.15, 0.2],
});

rightFrontHoof.userData['hoof'] = true;

leftLegJoint.add(leftFrontLeg);
leftFrontLeg.add(leftKnee);
leftKnee.add(leftFrontLegLower);
leftFrontLegLower.add(leftFrontHoof);

rightLegJoint.add(rightFrontLeg);
rightFrontLeg.add(rightKnee);
rightKnee.add(rightFrontLegLower);
rightFrontLegLower.add(rightFrontHoof);

// BACK

const leftRearLegJoint = new Object3D({
  position: [0.3, -0.2, 0.25],
  scale: [1, 1, 1],
  rotation: [-15, 0, 0],
});
leftRearLegJoint.visible = false;

const leftThigh = new Cube({
  position: [0, 0, 0],
  scale: [0.3, 1, 0.8],
});

const leftShank = new Cube({
  position: [0, -0.85, -0.1],
  scale: [0.285, 0.7, 0.55],
});

const leftRearKnee = new Object3D({
  position: [0, -0.35, -0.1],
  scale: [1, 1, 1],
  rotation: [-5, 0, 0],
});
leftRearKnee.visible = false;

const leftCalf = new Cube({
  position: [0, -0.325, 0],
  scale: [0.175, 0.65, 0.175],
});

const leftRearHoof = new Cube({
  position: [0, -0.4, 0],
  scale: [0.2, 0.15, 0.2],
});

leftRearHoof.userData['hoof'] = true;

const rightRearLegJoint = new Object3D({
  position: [-0.3, -0.2, 0.25],
  scale: [1, 1, 1],
  rotation: [-15, 0, 0],
});
rightRearLegJoint.visible = false;

const rightThigh = new Cube({
  position: [0, 0, 0],
  scale: [0.3, 1, 0.8],
});

const rightShank = new Cube({
  position: [0, -0.85, -0.1],
  scale: [0.285, 0.7, 0.55],
});

const rightRearKnee = new Object3D({
  position: [0, -0.35, -0.1],
  scale: [1, 1, 1],
  rotation: [-5, 0, 0],
});
rightRearKnee.visible = false;

const rightCalf = new Cube({
  position: [0, -0.325, 0],
  scale: [0.175, 0.65, 0.175],
});

const rightRearHoof = new Cube({
  position: [0, -0.4, 0],
  scale: [0.2, 0.15, 0.2],
});

rightRearHoof.userData['hoof'] = true;

leftRearHoof.setColor(0.1, 0.1, 0.1);
rightRearHoof.setColor(0.1, 0.1, 0.1);
leftFrontHoof.setColor(0.1, 0.1, 0.1);
rightFrontHoof.setColor(0.1, 0.1, 0.1);

leftRearLegJoint.add(leftThigh);
leftThigh.add(leftShank);
leftShank.add(leftRearKnee);
leftRearKnee.add(leftCalf);
leftCalf.add(leftRearHoof);

rightRearLegJoint.add(rightThigh);
rightThigh.add(rightShank);
rightShank.add(rightRearKnee);
rightRearKnee.add(rightCalf);
rightCalf.add(rightRearHoof);

export {
  leftFrontLeg,
  leftLegJoint,
  leftFrontHoof,
  leftFrontLegLower,
  rightFrontLeg,
  rightFrontLegLower,
  rightFrontHoof,
  rightLegJoint,
  leftRearLegJoint,
  rightRearLegJoint,
  leftRearHoof,
  rightRearHoof,
  leftKnee,
  rightKnee,
};
