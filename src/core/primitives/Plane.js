import { Matrix4 } from '../../../lib/cuon-matrix-cse160';
import { Object3D, Attribute } from '../Object3D';

class Plane extends Object3D {
  constructor({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
  }) {
    super({ position, scale, rotation });

    this.type = 'plane';
    this.visible = true;

    let wMid = width / 2;
    let hMid = height / 2;

    let seg_width = width / widthSegments;
    let seg_height = height / heightSegments;

    let vertices = [];
    let idx = [];
    let uvs = [];

    for (let i = 0; i < heightSegments + 1; i++) {
      var y = i * seg_height - hMid;

      for (let j = 0; j < widthSegments + 1; j++) {
        let x = j * seg_width - wMid;

        vertices.push(x, -y, 0);

        uvs.push(j / widthSegments);
        uvs.push(1 - i / heightSegments);
      }
    }

    for (let i = 0; i < heightSegments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        let a = i + (widthSegments + 1) * j;
        let b = i + (widthSegments + 1) * (j + 1);
        let c = i + 1 + (widthSegments + 1) * (j + 1);
        let d = i + 1 + (widthSegments + 1) * j;

        idx.push(a, b, d);
        idx.push(b, c, d);
      }
    }

    this.attributes.push(new Attribute(vertices, 3, 'aPosition'));
    this.attributes.push(new Attribute(uvs, 2, 'uv'));

    this.indices = new Uint8Array(idx);
  }
}

export { Plane };
