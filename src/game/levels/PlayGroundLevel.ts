import {
  BoxGeometry,
  CapsuleGeometry,
  FogExp2,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SphereGeometry,
  Spherical,
  Vector3,
} from 'three';

import {
  AmbientLightComponent,
  BaseEntity,
  BodyComponent,
  BodyType,
  CameraComponent,
  Constants,
  DirectionalLightComponent,
  HemisphereLightComponent,
  InputComponent,
  InputManager,
  ModelComponent,
  ModelManager,
  TextureManager,
  TransformComponent,
  VelocityComponent,
} from '@/engine';
import { BaseLevel } from '@/game';

class Player extends BaseEntity {
  async ready() {
    const inputManager = InputManager.getInstance();

    const camera = new CameraComponent(true);
    this.add(camera);

    const model = new Mesh(
      new CapsuleGeometry(0.5, 1, 4, 8),
      new MeshStandardMaterial({ shadowSide: 2 }),
    );

    const head = new Mesh(
      new SphereGeometry(0.5),
      new MeshStandardMaterial({ shadowSide: 2, color: 0xffff00 }),
    );
    head.position.y = 1.5;

    // TODO: Attach camera to head - find a better/more ECS way for his ?
    head.add(camera.instance);
    // Attach head to root model
    model.add(head);

    const body = new ModelComponent({ object: model });
    this.add(body);

    const transform = new TransformComponent({ translation: new Vector3(0, 0.75, 0) });
    this.add(transform);

    const velocity = new VelocityComponent();
    velocity.speed = 0.015;
    this.add(velocity);

    const userInput = new InputComponent((delta: number) => {
      const direction = inputManager?.getDirection('left', 'right', 'up', 'down');
      if (direction !== undefined) {
        const s = new Spherical();
        const angle = model.getWorldDirection(Constants.ZeroVector);
        s.setFromVector3(angle);
        direction.applyAxisAngle(Constants.UpVector, s.theta);

        // Separate velocity / position ??
        transform.translation?.addScaledVector(direction, velocity.speed * delta);
      }

      const event = inputManager.getActiveActionEvent('look');
      if (event !== undefined) {
        const x = (event as PointerEvent).movementX;
        const y = (event as PointerEvent).movementY;
        const sens = 2.0;

        head.rotateX(-MathUtils.degToRad(y) * sens);
        head.rotation.x = MathUtils.clamp(
          head.rotation.x,
          MathUtils.degToRad(-89),
          MathUtils.degToRad(90),
        );
        model.rotateY(-MathUtils.degToRad(x) * sens);
      }
    });
    this.add(userInput);

    this.add(new BodyComponent(BodyType.Character));
  }
}

class Tower extends BaseEntity {
  override async ready() {
    const manager = ModelManager.getInstance();

    const tower = new ModelComponent({
      object: await manager.loadGLTFModel('/models/tower/tower.gltf'),
    });
    this.add(
      tower,
      new BodyComponent(BodyType.Static),
      new TransformComponent({
        translation: new Vector3(-30, 14.0, -10),
        // rotation: new Vector3(0, -Math.PI / 2, 0),
      }),
    );
  }
}

class Floor extends BaseEntity {
  override async ready(): Promise<void> {
    const texture = TextureManager.getInstance();

    const floorTexture = texture.loadTexture('/textures/debug/light/texture_04.png');
    floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
    floorTexture.repeat.set(100, 100);
    const floor = new ModelComponent({
      material: new MeshBasicMaterial({
        map: floorTexture,
      }),
      geometry: new BoxGeometry(100, 1, 100),
    });

    this.add(
      floor,
      new BodyComponent(BodyType.Static),
      new TransformComponent({
        translation: new Vector3(0, -0.5, 0),
        rotation: new Vector3(0, Math.PI / 2, 0),
      }),
    );
  }
}

class AmbientLight extends BaseEntity {
  override async ready(): Promise<void> {
    this.add(new AmbientLightComponent(0xffffff, 0.5));
  }
}

class HemisphereLight extends BaseEntity {
  override async ready(): Promise<void> {
    this.add(new HemisphereLightComponent());
  }
}

class Sun extends BaseEntity {
  override async ready(): Promise<void> {
    const light = new DirectionalLightComponent();
    light.instance.position.set(1, 1.5, 1).multiplyScalar(50);
    light.instance.shadow.mapSize.setScalar(2048);
    light.instance.shadow.bias = -1e-4;
    light.instance.shadow.normalBias = 0.05;
    light.instance.castShadow = true;

    const shadowCam = light.instance.shadow.camera;
    shadowCam.bottom = shadowCam.left = -30;
    shadowCam.top = 30;
    shadowCam.right = 45;

    this.add(light);
  }
}

class Box extends BaseEntity {
  override async ready() {
    const texture = TextureManager.getInstance();

    const boxTexture = texture.loadTexture('/textures/debug/light/texture_01.png');
    boxTexture.wrapS = boxTexture.wrapT = RepeatWrapping;
    boxTexture.repeat.set(50, 50);
    const box = new ModelComponent({
      material: new MeshBasicMaterial({
        map: boxTexture,
      }),
      geometry: new BoxGeometry(5, 5, 5),
    });

    this.add(
      box,
      new BodyComponent(BodyType.Rigid),
      new TransformComponent({
        translation: new Vector3(20, 25, 20),
      }),
    );
  }
}

export class PlayGroundLevel extends BaseLevel {
  constructor() {
    super();
    this.backgroundColor = 0x263238 / 2;
  }

  override async ready() {
    this.fog = new FogExp2(this.backgroundColor, 0.02);
    this.background = TextureManager.getInstance().loadCubeTexture('/textures/skybox/basic', [
      'ft.png',
      'bk.png',
      'up.png',
      'dn.png',
      'rt.png',
      'lf.png',
    ]);

    this.addEntity(
      new Tower(),
      new Box(),
      new Floor(),
      new AmbientLight(),
      // new HemisphereLight(),
      new Sun(),
      new Player(),
    );

    await super.ready();
  }
}
