import { Object3D, Attribute } from '../Object3D';

class Cube extends Object3D {
  constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    super(position, rotation, scale);

    this.type = 'cube';
    this.visible = true;

    this.attributes.push(
      new Attribute(
        new Float32Array([
          /**
           * FRONT
           */
          /// triangle 1
          // v1
          -0.5, 0.5, 0.5,
          // v0
          -0.5, -0.5, 0.5,
          // v2
          0.5, -0.5, 0.5,
          /// triangle 2
          // v1
          -0.5, 0.5, 0.5,
          // v2
          0.5, -0.5, 0.5,
          // v3
          0.5, 0.5, 0.5,
          /**
           * LEFT
           */
          /// triangle 1
          // v5
          -0.5, 0.5, -0.5,
          // v4
          -0.5, -0.5, -0.5,
          // v0
          -0.5, -0.5, 0.5,
          /// triangle 2
          // v5
          -0.5, 0.5, -0.5,
          // v0
          -0.5, -0.5, 0.5,
          // v1
          -0.5, 0.5, 0.5,
          /**
           * RIGHT
           */
          /// triangle 1
          // v3
          0.5, 0.5, 0.5,
          // v2
          0.5, -0.5, 0.5,
          // v6
          0.5, -0.5, -0.5,
          /// triangle 2
          // v3
          0.5, 0.5, 0.5,
          // v6
          0.5, -0.5, -0.5,
          // v7
          0.5, 0.5, -0.5,
          /**
           * TOP
           */
          /// triangle 1
          // v5
          -0.5, 0.5, -0.5,
          // v1
          -0.5, 0.5, 0.5,
          // v3
          0.5, 0.5, 0.5,
          /// triangle 2
          // v5
          -0.5, 0.5, -0.5,
          // v3
          0.5, 0.5, 0.5,
          // v7
          0.5, 0.5, -0.5,
          /**
           * BACK
           */
          /// triangle 1
          // v7
          0.5, 0.5, -0.5,
          // v6
          0.5, -0.5, -0.5,
          // v5
          -0.5, 0.5, -0.5,
          /// triangle 2
          // v5
          -0.5, 0.5, -0.5,
          // v6
          0.5, -0.5, -0.5,
          // v4
          -0.5, -0.5, -0.5,
          /**
           * BOTTOM
           */
          ///triangle 1
          // v0
          -0.5, -0.5, 0.5,
          // v4
          -0.5, -0.5, -0.5,
          // v6
          0.5, -0.5, -0.5,
          /// triangle 2
          // v0
          -0.5, -0.5, 0.5,
          // v6
          0.5, -0.5, -0.5,
          // v2
          0.5, -0.5, 0.5,
        ]),
        3,
        'aPosition'
      )
    );

    this.attributes.push(
      new Attribute(
        new Float32Array([
          // FRONT
          0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
          // LEFT
          0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
          // RIGHT
          0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
          // TOP
          1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
          // BACK
          0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,
          // BOTTOM
          0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        ]),
        2,
        'uv'
      )
    );

    this.attributes.push(
      new Attribute(
        new Float32Array([
          // FRONT
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
          // LEFT
          -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
          // RIGHT
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
          // TOP
          0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
          // BACK
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
          // BOTTOM
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        ]),
        3,
        'normal'
      )
    );

    let temp = [];

    for (let i = 0; i < 36; i++) {
      temp.push(i);
    }

    this.indices = new Uint16Array(temp);
  }
}

export { Cube };
