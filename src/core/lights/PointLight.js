import { Attribute, Object3D } from '../Object3D';
import fragmentShader from '../shaders/light/light.frag';
import vertexShader from '../shaders/light/light.vert';

class PointLight extends Object3D {
  constructor(
    position = [0, 0, 0],
    color = [1, 1, 1],
    intensity = 1,
    specularExponent = 30.0
  ) {
    super(position);

    this.type = 'point light';
    this.drawType = 'points';
    this.transparent = true;

    this.setColor(color);
    this.intensity = intensity;

    this.specularExponent = specularExponent;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.attributes.push(
      new Attribute(new Float32Array(position), 3, 'aPosition')
    );

    this.indices = new Uint16Array([0]);

    return this;
  }
}

export { PointLight };
