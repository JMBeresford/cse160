import { Cube } from './core/primitives/Cube';
import vertexShader from './shaders/Rock/rock.vert';
import fragmentShader from './shaders/Rock/rock.frag';
import { Uniform } from './core/Object3D';
import { Vector3 } from '../lib/cuon-matrix-cse160';

let _v1 = new Vector3();

class Rock extends Cube {
  constructor({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
  }) {
    super({ position, rotation, scale });

    this.type = 'rock';

    this.setColor([0.2, 0.2, 0.4]);
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.uniforms['uCameraPos'] = new Uniform(null, 3, 'vec3');
    this.uniforms['uBrightness'] = new Uniform([1], 1, 'float');

    console.log(this);

    return this;
  }

  getWorldPosition() {
    let p = [..._v1.set(this.position).add(this.parent.position).elements];

    return p;
  }

  setWorldPosition() {}
}

export { Rock };
