import { AmbientLightComponent, BaseEntity, CameraComponent, RigidBodyComponent } from '@/engine';
import { BaseLevel } from '@/game';
import { BoxGeometry, Color, MeshBasicMaterial, Vector3 } from 'three';

class CameraEntity extends BaseEntity {
  private _position: Vector3;

  constructor() {
    super();

    this._position = new Vector3(0, 5, 0);
    const cameraComponent = new CameraComponent(`Camera`);
    this.addComponent(cameraComponent);
    this.addComponent(new AmbientLightComponent('Ambient'));
  }

  async ready() {
    const c = this.getComponent<CameraComponent>(`Camera`);
    c.instance.position.set(this._position.x, this._position.y, this._position.z);
    c.instance.lookAt(new Vector3(0, 0, 0));
  }
}

class TestCubeEntity extends BaseEntity {
  constructor() {
    super('TestCube');
  }

  async ready() {
    const body = new RigidBodyComponent({
      name: 'Body',
      material: new MeshBasicMaterial({ color: 0xff69b4 }),
      geometry: new BoxGeometry(1, 1, 1),
    });

    this.addComponent(body);
  }

  update(delta: number) {
    const b = this.getComponent<RigidBodyComponent>('Body');
    b.object.rotation.x = delta * 0.001;
    b.object.rotation.z = delta * 0.001;
  }
}

export class HelloWorldLevel extends BaseLevel {
  async ready() {
    this.background = new Color(0x151515);
    this.addGameEntity(new CameraEntity());
    this.addGameEntity(new TestCubeEntity());
  }
}
