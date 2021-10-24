import { Attribute, Object3D } from '../core/Object3D';

const Mane = new Object3D({
  rotation: [0, -90, 0],
  position: [0, -0.5, 0],
  scale: [1.2, 3.5, 1],
});

let vertCount = 1500;
let vertices = [];
let offsets = [];
let indices = [];

for (let i = 0; i < vertCount; i++) {
  let x = Math.pow(Math.random(), 2) * 1.2;
  let y = Math.random() - 0.5;
  let z = Math.random() - 0.5;

  let offset = Math.random();

  offsets.push(offset);
  vertices.push(x, y, z);
  indices.push(i);
}

Mane.attributes.push(new Attribute(vertices, 3, 'aPosition'));
Mane.attributes.push(new Attribute(vertices, 1, 'aOffset'));
Mane.indices = new Uint8Array(indices);

Mane.setColor(1, 0.6196, 0.6196);
Mane.visible = true;
Mane.transparent = true;
Mane.drawType = 'points';
Mane.depthTest = true;

const Tail = new Object3D({
  rotation: [0, 0, 0],
  position: [0, 0.375, 0.6],
  scale: [1, 1, 1],
});

vertices = [];
offsets = [];
indices = [];

for (let i = 0; i < vertCount; i++) {
  let x = Math.pow(Math.random() - 0.5, 5);
  let y = Math.pow(Math.random() - 0.5, 5);
  let z = Math.random() * 2;

  let offset = Math.random() * 5;

  offsets.push(offset);
  vertices.push(x, y, z);
  indices.push(i);
}

Tail.attributes.push(new Attribute(vertices, 3, 'aPosition'));
Tail.attributes.push(new Attribute(vertices, 1, 'aOffset'));
Tail.indices = new Uint8Array(indices);

Tail.setColor(1, 0.6196, 0.6196);
Tail.visible = true;
Tail.transparent = true;
Tail.drawType = 'points';
Tail.depthTest = true;

export { Mane, Tail };
