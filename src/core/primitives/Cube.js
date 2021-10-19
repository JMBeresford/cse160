import { Matrix4 } from '../../../lib/cuon-matrix-cse160';
import { Object3D, Attribute } from '../Object3D';

class Cube extends Object3D {
  constructor({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  }) {
    super({ position, scale, rotation });

    this.type = 'cube';

    this.attributes.push(
      new Attribute(
        new Float32Array([
          // v0
          -0.5, -0.5, 0.5,
          // v1
          -0.5, 0.5, 0.5,
          // v2
          0.5, -0.5, 0.5,
          // v3
          0.5, 0.5, 0.5,
          // v4
          -0.5, -0.5, -0.5,
          // v5
          -0.5, 0.5, -0.5,
          // v6
          0.5, -0.5, -0.5,
          // v7
          0.5, 0.5, -0.5,
        ]),
        3,
        'aPosition'
      )
    );

    this.attributes.push(
      new Attribute(
        new Float32Array([
          // v0
          0.0, 0.0, 1.0,
          //v1
          0.0, 1.0, 0.0,
          //v2
          0.0, 1.0, 1.0,
          //v3
          1.0, 0.0, 0.0,
          //v4
          1.0, 0.0, 1.0,
          //v5
          1.0, 1.0, 0.0,
          //v6
          0.5, 1.0, 1.0,
          //v7
          1.0, 0.5, 0.1,
        ]),
        3,
        'aColor'
      )
    );

    this.indices = new Uint8Array([
      // front
      0, 2, 1, 1, 2, 3,
      // right
      3, 2, 6, 3, 6, 7,
      // back
      5, 4, 6, 5, 6, 7,
      // left
      5, 4, 0, 5, 0, 1,
      // top
      5, 1, 3, 5, 3, 7,
      // bottom
      0, 4, 6, 0, 6, 2,
    ]);
  }
}

export { Cube };
