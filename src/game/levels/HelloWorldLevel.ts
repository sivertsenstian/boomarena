import { BoxGeometry, Color, MeshBasicMaterial, Spherical, Vector3 } from 'three';

import {
  AmbientLightComponent,
  BaseEntity,
  CameraComponent,
  Constants,
  InputComponent,
  InputManager,
  ModelComponent,
  TargetComponent,
  TransformComponent,
} from '@/engine';
import { BaseLevel } from '@/game';
import { AnimationComponent, AnimationType } from '@/engine/components/AnimationComponent';

class WorldCamera extends BaseEntity {
  async ready() {
    this.add(
      new CameraComponent(true),
      new TransformComponent({ translation: new Vector3(0, 5, 0) }),
      new AmbientLightComponent(0xff0000),
      new TargetComponent(),
    );
  }
}

class TestCube extends BaseEntity {
  async ready() {
    const model = new ModelComponent({
      material: new MeshBasicMaterial({ color: 0xff69b4 }),
      geometry: new BoxGeometry(1, 1, 1),
    });
    this.add(model);

    const transform = new TransformComponent();
    this.add(transform);

    const inputManager = InputManager.getInstance();
    const userInput = new InputComponent((delta: number) => {
      const direction = inputManager?.getDirection('left', 'right', 'up', 'down');
      if (direction !== undefined) {
        const s = new Spherical();
        const angle = model.instance.getWorldDirection(Constants.ZeroVector);
        s.setFromVector3(angle);
        direction.applyAxisAngle(Constants.UpVector, s.theta);
        transform.rotation?.addScaledVector(direction, 0.0025 * delta);
      }
    });
    this.add(userInput);

    const animation = new AnimationComponent([
      {
        type: AnimationType.Rotation,
        duration: 'continuous',
        value: new Vector3(0.0, 0, 0.0025),
      },
    ]);
    this.add(animation);
  }
}

export class HelloWorldLevel extends BaseLevel {
  async ready() {
    this.background = new Color(0x151515);
    this.addEntity(new WorldCamera(), new TestCube());

    await super.ready();
  }
}
