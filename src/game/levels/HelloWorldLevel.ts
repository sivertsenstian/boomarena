import {
  AmbientLightComponent,
  BaseEntity,
  CameraComponent,
  CharacterBodyComponent,
  PointLightComponent,
  RigidBodyComponent,
  StaticBodyComponent,
} from '@/engine';
import { BaseLevel } from '@/game';
import { BoxGeometry, Color, Euler, MeshBasicMaterial, MeshLambertMaterial, Vector3 } from 'three';

class CameraEntity extends BaseEntity {
  private _position: Vector3;

  constructor() {
    super();

    this._position = new Vector3(0, 5, 0);
    const cameraComponent = new CameraComponent(`Camera`);
    this.addComponent(cameraComponent);
    this.addComponent(new AmbientLightComponent('Ambient'));
  }

  ready() {
    const c = this.getComponent<CameraComponent>(`Camera`);
    c.object.position.set(this._position.x, this._position.y, this._position.z);
    c.object.lookAt(new Vector3(0, 0, 0));
  }
}

class TestCubeEntity extends BaseEntity {
  constructor() {
    super('TestCube');
  }

  ready() {
    const body = new RigidBodyComponent(
      new MeshBasicMaterial({ color: 0xff69b4 }),
      new BoxGeometry(1, 1, 1),
      'Body',
    );

    this.addComponent(body);
  }

  update(delta: number) {
    const b = this.getComponent<RigidBodyComponent>('Body');
    b.object.rotation.x = delta * 0.001;
    b.object.rotation.z = delta * 0.001;
  }
}

export class HelloWorldLevel extends BaseLevel {
  ready() {
    this.background = new Color(0x151515);
    this.addGameEntity(new CameraEntity());
    this.addGameEntity(new TestCubeEntity());
  }
}
