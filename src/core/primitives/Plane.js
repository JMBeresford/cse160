import { Matrix4 } from '../../../lib/cuon-matrix-cse160';
import { Object3D, Attribute } from '../Object3D';

class Plane extends Object3D {
  constructor(
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1]
  ) {
    super(position, rotation, scale);

    this.type = 'plane';
    this.visible = true;
    this.drawType = 'triangles';

    const wMid = width / 2;
    const hMid = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);

    const gridX1 = gridX + 1;
    const gridY1 = gridY + 1;

    const seg_width = width / gridX;
    const seg_height = height / gridY;

    const vertices = [];
    const idx = [];
    const uvs = [];
    const normals = [];

    for (let i = 0; i < gridY1; i++) {
      const y = i * seg_height - hMid;

      for (let j = 0; j < gridX1; j++) {
        let x = j * seg_width - wMid;

        vertices.push(x, -y, 0);

        // facing towards camera at first
        normals.push(0, 0, 1);

        uvs.push(j / gridX);
        uvs.push(1 - i / gridY);
      }
    }

    for (let i = 0; i < gridY; i++) {
      for (let j = 0; j < gridX; j++) {
        let a = j + gridX1 * i;
        let b = j + gridX1 * (i + 1);
        let c = j + 1 + gridX1 * (i + 1);
        let d = j + 1 + gridX1 * i;

        idx.push(a, b, d);
        idx.push(b, c, d);
      }
    }

    this.attributes.push(new Attribute(vertices, 3, 'aPosition'));
    this.attributes.push(new Attribute(uvs, 2, 'uv'));
    this.attributes.push(new Attribute(normals, 3, 'normal'));

    this.indices = new Uint16Array(idx);
  }
}

export { Plane };
