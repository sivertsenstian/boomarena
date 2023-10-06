import {
  AmbientLightComponent,
  BaseEntity,
  CameraComponent,
  CharacterBodyComponent,
  InputManager,
  PointLightComponent,
  StaticBodyComponent,
  TextureManager,
} from '@/engine';
import { BaseLevel } from '@/game';
import {
  BackSide,
  BoxGeometry,
  CapsuleGeometry,
  Color,
  Euler,
  FogExp2,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Vector3,
} from 'three';

import tst from '/textures/skybox/back.png';

class Lights extends BaseEntity {
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

class Player extends BaseEntity {
  private _speed = 0.015;

  private _input?: InputManager;

  constructor() {
    super();
    this._input = InputManager.getInstance();
  }

  ready() {
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

class Ground extends BaseEntity {
  constructor() {
    super();
  }

  ready() {
    const body = new StaticBodyComponent(
      'Body',
      new MeshLambertMaterial({ color: 0xffffff, wireframe: false }),
      new BoxGeometry(60, 0.25, 60),
    );

    body.object.setRotationFromEuler(new Euler(0, Math.PI / 2, 0));
    body.object.position.set(0, -0.25, 0);

    this.addComponent(body);
  }
}

export class PlayGroundLevel extends BaseLevel {
  ready() {
    this.fog = new FogExp2(0xcccccccc, 0.002);
    this.background = TextureManager.getInstance().loadCubeTexture('/textures/skybox/', [
      'ft.png',
      'bk.png',
      'up.png',
      'dn.png',
      'rt.png',
      'lf.png',
    ]);

    // this.addGameEntity(new CameraEntity('Camera1', new Vector3(50, 50, 0), new Vector3(0, 0, 0)));
    this.addGameEntity(new Lights());
    this.addGameEntity(new Player());
    this.addGameEntity(new Ground());
  }
}
