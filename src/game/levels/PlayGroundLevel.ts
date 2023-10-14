import {
  BoxGeometry,
  CapsuleGeometry,
  Euler,
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
  CameraComponent,
  CharacterBodyComponent,
  DirectionalLightComponent,
  HemisphereLightComponent,
  InputManager,
  StaticBodyComponent,
  TextureManager,
  ModelManager,
  MovementComponent,
  InputComponent,
  Constants,
} from '@/engine';
import { BaseLevel } from '@/game';

class Player extends BaseEntity {
  constructor() {
    super();
  }

  async ready() {
    const inputManager = InputManager.getInstance();

    const camera = new CameraComponent('Camera');
    camera.isCurrent = true;
    this.addComponent(camera);

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

    const body = new CharacterBodyComponent({ name: 'PlayerModel', object: model });
    this.addComponent(body);

    const movement = new MovementComponent();
    movement.speed = 0.015;
    movement.position = new Vector3(0, 0.75, 0);
    this.addComponent(movement);

    const userInput = new InputComponent('UserInput', (delta: number) => {
      const direction = inputManager?.getDirection('left', 'right', 'up', 'down');
      if (direction !== undefined) {
        const s = new Spherical();
        const angle = model.getWorldDirection(Constants.ZeroVector);
        s.setFromVector3(angle);
        direction.applyAxisAngle(Constants.UpVector, s.theta);
        movement.position.addScaledVector(direction, movement.speed * delta);
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
    this.addComponent(userInput);
  }
}

class Environment extends BaseEntity {
  constructor() {
    super();
  }

  override async ready() {
    const manager = ModelManager.getInstance();
    const texture = TextureManager.getInstance();

    // Lights & Camera
    this.addComponent(new AmbientLightComponent('Ambient', 0xffffff, 0.5));

    const light = new DirectionalLightComponent('Light');
    light.object.position.set(1, 1.5, 1).multiplyScalar(50);
    light.object.shadow.mapSize.setScalar(2048);
    light.object.shadow.bias = -1e-4;
    light.object.shadow.normalBias = 0.05;
    light.object.castShadow = true;

    const shadowCam = light.object.shadow.camera;
    shadowCam.bottom = shadowCam.left = -30;
    shadowCam.top = 30;
    shadowCam.right = 45;

    this.addComponent(light);

    const hemisphere = new HemisphereLightComponent('Hemisphere');
    this.addComponent(hemisphere);

    const camera = new CameraComponent('Camera');
    camera.instance.position.set(10, 20, 10);
    camera.instance.lookAt(new Vector3(0, 0, 0));
    camera.isCurrent = false;
    this.addComponent(camera);

    // Floor
    const bodyMap = texture.loadTexture('/textures/debug/orange/texture_04.png');
    bodyMap.wrapS = bodyMap.wrapT = RepeatWrapping;
    bodyMap.repeat.set(100, 100);
    const body = new StaticBodyComponent({
      name: 'Floor',
      material: new MeshBasicMaterial({
        map: bodyMap,
      }),
      geometry: new BoxGeometry(100, 1, 100),
    });

    body.object.setRotationFromEuler(new Euler(0, Math.PI / 2, 0));
    body.object.position.set(0, -0.5, 0);
    this.addComponent(body);

    // Debug Box
    const boxMap = texture.loadTexture('/textures/debug/purple/texture_01.png');
    boxMap.wrapS = boxMap.wrapT = RepeatWrapping;
    boxMap.repeat.set(5, 5);
    const box = new StaticBodyComponent({
      name: 'DebugBox',
      material: new MeshBasicMaterial({
        map: boxMap,
      }),
      geometry: new BoxGeometry(5, 5, 5),
    });

    box.object.position.set(25, 2.5, 20);
    this.addComponent(box);

    // Import test - Tower
    const tower = new StaticBodyComponent({
      name: 'Tower',
      object: await manager.loadGLTFModel('/models/tower/tower.gltf'),
    });
    tower.object.scale.multiplyScalar(5);
    tower.object.position.set(-30, 9.0, -10);
    tower.object.setRotationFromEuler(new Euler(0, -Math.PI / 2, 0));
    this.addComponent(tower);
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

    this.addGameEntity(new Environment());
    this.addGameEntity(new Player());

    await super.ready();
  }
}
