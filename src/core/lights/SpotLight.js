import { Attribute, Object3D } from '../Object3D';
import fragmentShader from '../shaders/light/light.frag';
import vertexShader from '../shaders/light/light.vert';

class SpotLight extends Object3D {
  constructor(
    position = [0, 0, 0],
    target = [0, 0, 1],
    cutoffAngle = 15,
    color = [1, 1, 1],
    intensity = 1,
    specularExponent = 30
  ) {
    super(position);

    this.type = 'spot light';
    this.drawType = 'points';

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.setColor(color);
    this.intensity = intensity;
    this.specularExponent = specularExponent;
    this.cutoffAngle = cutoffAngle;
    this.target = target;

    this.attributes.push(
      new Attribute(new Float32Array(position), 3, 'aPosition')
    );

    this.indices = new Uint16Array([0]);

    return this;
  }
}

export { SpotLight };
