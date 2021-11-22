import { Cube } from './core/primitives/Cube';
import vertexShader from './shaders/Rock/rock.vert';
import fragmentShader from './shaders/Rock/rock.frag';
import { Vector3 } from '../lib/cuon-matrix-cse160';

let _v1 = new Vector3();

class Rock extends Cube {
  constructor(position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
    super(position, rotation, scale);

    this.type = 'rock';

    this.setColor([0.2, 0.2, 0.4]);
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    return this;
  }

  getWorldPosition() {
    let p = [..._v1.set(this.position).add(this.parent.position).elements];

    return p;
  }

  setWorldPosition() {}
}

export { Rock };
