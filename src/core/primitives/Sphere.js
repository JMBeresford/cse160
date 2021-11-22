import { Vector3 } from '../../../lib/cuon-matrix-cse160';
import { Object3D, Attribute } from '../Object3D';

class Sphere extends Object3D {
  constructor(
    radius,
    widthSegments,
    heightSegments,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1]
  ) {
    super(position, rotation, scale);

    this.visible = true;

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    let index = 0;
    const grid = [];

    const vertex = new Vector3();
    const normal = new Vector3();

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    for (let j = 0; j <= heightSegments; j++) {
      const row = [];

      const v = j / heightSegments;

      let uOffset = 0;
      // special cases for poles
      if (j == 0) {
        uOffset = 0.5 / widthSegments;
      } else if (j == heightSegments) {
        uOffset = -0.5 / widthSegments;
      }

      for (let i = 0; i <= widthSegments; i++) {
        const u = i / widthSegments;

        vertex.elements[0] =
          -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);

        vertex.elements[1] = radius * Math.cos(v * Math.PI);

        vertex.elements[2] =
          radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);

        vertices.push(...vertex.elements);
        normal.set(vertex).normalize();

        normals.push(...normal.elements);

        uvs.push(u + uOffset, 1 - v);

        row.push(index++);
      }

      grid.push(row);
    }

    for (let j = 0; j < heightSegments; j++) {
      for (let i = 0; i < widthSegments; i++) {
        const a = grid[j][i + 1];
        const b = grid[j][i];
        const c = grid[j + 1][i];
        const d = grid[j + 1][i + 1];

        if (j !== 0) indices.push(a, b, d);
        if (j !== heightSegments - 1) indices.push(b, c, d);
      }
    }

    this.attributes.push(
      new Attribute(new Float32Array(vertices), 3, 'aPosition')
    );

    this.attributes.push(new Attribute(new Float32Array(uvs), 2, 'uv'));

    this.attributes.push(new Attribute(new Float32Array(normals), 3, 'normal'));

    this.indices = new Uint16Array(indices);
  }
}

export { Sphere };
