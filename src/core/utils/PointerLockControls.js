import { Vector3 } from '../../../lib/cuon-matrix-cse160';

var _v1 = new Vector3();
var _v2 = new Vector3();

class PointerLockControls {
  constructor(camera, canvas, camBody, allowVerticalMovement = false) {
    if (!camera || !canvas) {
      console.error('Camera constructor arguments are null');
      return;
    }

    this.canvas = canvas;
    this.camera = camera;
    this.camBody = camBody;

    this.state = {
      locked: false,
      left: false,
      right: false,
      up: false,
      down: false,
      lookLeft: false,
      lookRight: false,
      moveY: allowVerticalMovement,
    };

    canvas.onpointerdown = (e) => {
      if (e.button == 0) {
        canvas.requestPointerLock({ unadjustedMovement: true });
      }
    };

    document.onpointerlockchange = (e) => {
      if (document.pointerLockElement === canvas) {
        this.state.locked = true;
      } else {
        this.state.locked = false;
      }
    };

    document.onkeydown = (e) => {
      if (!this.state.locked) return;

      switch (e.key) {
        case 'a': {
          this.state.left = true;
          break;
        }

        case 's': {
          this.state.down = true;
          break;
        }

        case 'w': {
          this.state.up = true;
          break;
        }

        case 'd': {
          this.state.right = true;
          break;
        }

        case 'q': {
          this.state.lookLeft = true;
          break;
        }

        case 'e': {
          this.state.lookRight = true;
          break;
        }
      }
    };

    document.onkeyup = (e) => {
      if (!this.state.locked) return;

      switch (e.key) {
        case 'a': {
          this.state.left = false;
          break;
        }

        case 's': {
          this.state.down = false;
          break;
        }

        case 'w': {
          this.state.up = false;
          break;
        }

        case 'd': {
          this.state.right = false;
          break;
        }

        case 'q': {
          this.state.lookLeft = false;
          break;
        }

        case 'e': {
          this.state.lookRight = false;
          break;
        }
      }
    };

    canvas.onpointermove = (e) => {
      if (this.state.locked) {
        const [x, y, z] = camera.getRotation();

        let dx = e.movementX * 0.06;
        let dy = e.movementY * 0.06;

        camera.setRotation(x - dy, y - dx, z);
      }
    };

    return this;
  }

  getLock = () => {
    if (e.button == 0) {
      this.canvas.requestPointerLock({ unadjustedMovement: true });
    }
  };

  update() {
    if (this.state.left) {
      const [x, y, z] = this.camera.getPosition();

      _v1.set(this.camera.target);
      let dir = _v1.sub(this.camera.position).normalize();

      let left = Vector3.cross(dir, this.camera.up).div(-13);

      _v1.set([x, y, z]).add(left);

      this.camera.target.add(left);
      this.camera.setPosition(_v1);
    }

    if (this.state.right) {
      const [x, y, z] = this.camera.getPosition();

      _v1.set(this.camera.target);
      let dir = _v1.sub(this.camera.position).normalize();

      let right = Vector3.cross(dir, this.camera.up).div(13);

      _v1.set([x, y, z]).add(right);

      this.camera.target.add(right);
      this.camera.setPosition(_v1);
    }

    if (this.state.up) {
      const [x, y, z] = this.camera.getPosition();

      _v1.set(this.camera.target);
      let dir = _v1.sub(this.camera.position);

      if (!this.state.moveY) {
        dir.elements[1] = 0;
      }

      dir.normalize();

      _v2.set(dir);
      let forward = _v2.div(13);

      _v1.set([x, y, z]).add(forward);

      this.camera.target.add(forward);
      this.camera.setPosition(_v1);
    }

    if (this.state.down) {
      const [x, y, z] = this.camera.getPosition();

      _v1.set(this.camera.target);
      let dir = _v1.sub(this.camera.position);

      if (!this.state.moveY) {
        dir.elements[1] = 0;
      }

      dir.normalize();

      _v2.set(dir);
      let backward = _v2.div(-13);

      _v1.set([x, y, z]).add(backward);

      this.camera.target.add(backward);
      this.camera.setPosition(_v1);
    }

    if (this.state.lookLeft) {
      const [x, y, z] = this.camera.getRotation();

      let dx = -0.75;

      this.camera.setRotation(x, y - dx, z);
    }

    if (this.state.lookRight) {
      const [x, y, z] = this.camera.getRotation();

      let dx = 0.75;

      this.camera.setRotation(x, y - dx, z);
    }
  }
}

export { PointerLockControls };
