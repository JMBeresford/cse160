import { Vector3 } from '../lib/cuon-matrix-cse160';
import { Object3D } from './core/Object3D';
import { Rock } from './Rock';

let p = new Vector3();
let s = new Vector3();

class Pile extends Object3D {
  constructor({
    amount = 3,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [0.5, 0.25, 0.325],
  }) {
    super({ position, scale, rotation });
    let w = scale[0];
    let h = scale[1];

    let offset = Math.random() * 1.2;

    for (let layer = 1; layer <= amount; layer++) {
      if (layer % 2 === 0) {
        for (let evenrock = 0; evenrock < layer; evenrock++) {
          let r = new Rock({
            position: [
              (layer / 2 - 0.5 - evenrock) * w + offset,
              (amount - 1 - layer) * h + h / 2 + offset,
              0,
            ],
            scale: [scale[0], scale[1], scale[2] + layer * 0.05],
            rotation: [0, Math.random() * 15, 0],
          });

          this.add(r);
        }
      } else {
        for (let oddrock = 0; oddrock < layer; oddrock++) {
          let r = new Rock({
            position: [
              (Math.floor(layer / 2) - oddrock) * w + offset,
              (amount - 1 - layer) * h + h / 2 + offset,
              0,
            ],
            scale: [scale[0], scale[1], scale[2] + layer * 0.05],
            rotation: [0, Math.random() * 15, 0],
          });

          this.add(r);
        }
      }
    }
    return this;
  }
}

export { Pile };
