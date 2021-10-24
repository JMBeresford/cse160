import { Attribute, Object3D } from '../core/Object3D';

const eyes = new Object3D({
  position: [0, 0.1, -0.33],
  scale: [1, 1, 1],
});

eyes.attributes.push(
  new Attribute(new Float32Array([-0.15, 0, 0, 0.15, 0, 0]), 3, 'aPosition')
);

eyes.indices = new Uint8Array([0, 1]);

eyes.setColor(0.24, 0.55, 0.77);

eyes.visible = true;
eyes.transparent = true;
eyes.drawType = 'points';

export { eyes };
