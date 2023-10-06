import {
  AmbientLightComponent,
  BaseEntity,
  CameraComponent,
  CharacterBodyComponent,
  InputManager,
  PointLightComponent,
  StaticBodyComponent,
} from '@/engine';
import { BaseLevel } from '@/game';
import { BoxGeometry, CapsuleGeometry, Color, Euler, MeshLambertMaterial, Vector3 } from 'three';

class LightsEntity extends BaseEntity {
  constructor() {
    super();
  }

  ready() {
    this.addComponent(new AmbientLightComponent('Ambient'));

    const l1 = new PointLightComponent('Light1');
    l1.object.position.set(0, 5, 0);
    l1.object.intensity = 100;
    l1.object.lookAt(new Vector3(0, 0, 0));
    this.addComponent(l1);
  }
}

class PlayerEntity extends BaseEntity {
  private _speed = 0.015;

  private _input?: InputManager;

  constructor() {
    super('Player');
  }

  ready() {
    this._input = InputManager.getInstance();

    const body = new CharacterBodyComponent(
      'Body',
      new MeshLambertMaterial({ color: 0xcf6d17, wireframe: false }),
      new CapsuleGeometry(1, 1, 4, 8),
    );
    this.position.y = 1;
    this.addComponent(body);

    const camera = new CameraComponent('Camera');
    // camera.object.position.y = 10;
    // camera.object.position.z = 10;
    // camera.object.lookAt(this.position);

    this.addComponent(camera);
  }

  update(delta: number) {
    const direction = this._input?.getDirection('left', 'right', 'up', 'down');

    if (direction !== undefined) {
      this.position.x += this._speed * delta * direction.x;
      this.position.z += this._speed * delta * direction.y;
    }
  }
}

class GroundEntity extends BaseEntity {
  constructor() {
    super('Ground');
  }

  ready() {
    const body = new StaticBodyComponent(
      new MeshLambertMaterial({ color: 0xffffff, wireframe: false }),
      new BoxGeometry(60, 0.25, 60),
      'Body',
    );

    body.object.setRotationFromEuler(new Euler(0, Math.PI / 2, 0));
    body.object.position.set(0, -0.25, 0);

    this.addComponent(body);
  }
}

export class PlayGroundLevel extends BaseLevel {
  ready() {
    this.background = new Color(0x202020);

    // this.addGameEntity(new CameraEntity('Camera1', new Vector3(50, 50, 0), new Vector3(0, 0, 0)));
    this.addGameEntity(new LightsEntity());
    this.addGameEntity(new PlayerEntity());
    this.addGameEntity(new GroundEntity());
  }
}
