import {
  BoxGeometry,
  CapsuleGeometry,
  Euler,
  FogExp2,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  SphereGeometry,
  Spherical,
  Vector2,
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
  UserControlledEntity,
  ModelManager,
  InputEvent,
  InputEventType,
} from '@/engine';
import { BaseLevel } from '@/game';

class Environment extends BaseEntity {
  constructor() {
    super();
  }

  async ready() {
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
  }
}

class Player extends UserControlledEntity {
  private _speed = 0.015;

  private _input?: InputManager;

  constructor() {
    super();
    this._input = InputManager.getInstance();
    this.up = new Vector3(0, 1, 0);
  }

  processInput(event: InputEvent) {
    if (event.type === InputEventType.PointerEvent) {
      const x = (event as PointerEvent).movementX;
      const y = (event as PointerEvent).movementY;
      const sens = 2.0;

      const head = this.getComponent<CharacterBodyComponent>('Head');
      head.object.rotateX(-MathUtils.degToRad(y) * sens);
      head.object.rotation.x = MathUtils.clamp(
        head.object.rotation.x,
        MathUtils.degToRad(-89),
        MathUtils.degToRad(90),
      );
      this.rotateY(-MathUtils.degToRad(x) * sens);
    }
  }

  async ready() {
    const body = new CharacterBodyComponent({
      name: 'Body',
      material: new MeshStandardMaterial({ shadowSide: 2 }),
      geometry: new CapsuleGeometry(0.5, 1, 4, 8),
    });
    body.object.position.y = 0.75;
    body.object.castShadow = true;
    body.object.receiveShadow = true;

    this.addComponent(body);

    const head = new CharacterBodyComponent({
      name: 'Head',
      material: new MeshStandardMaterial({ shadowSide: 2, color: 0xffff00 }),
      geometry: new SphereGeometry(0.5),
    });
    head.object.position.y = 2.0;
    this.addComponent(head);

    const camera = new CameraComponent('Camera');
    camera.isCurrent = true;
    this.addComponent(camera);

    head.object.add(camera.instance);
  }

  update(delta: number) {
    const direction = this._input?.getDirection('left', 'right', 'up', 'down');
    if (direction !== undefined) {
      const s = new Spherical();
      const angle = this.getWorldDirection(new Vector3());
      s.setFromVector3(angle);
      direction.applyAxisAngle(new Vector3(0, 1, 0), s.theta);
      this.position.addScaledVector(direction, this._speed * delta);
    }
  }
}

class Ground extends BaseEntity {
  constructor() {
    super();
  }

  async ready() {
    const manager = ModelManager.getInstance();
    const texture = TextureManager.getInstance();

    // Floor
    const bodyMap = texture.loadTexture('/textures/debug/dark/texture_03.png');
    bodyMap.wrapS = bodyMap.wrapT = RepeatWrapping;
    bodyMap.repeat.set(100, 100);
    const body = new StaticBodyComponent({
      name: 'Floor',
      material: new MeshStandardMaterial({
        map: bodyMap,
      }),
      geometry: new BoxGeometry(100, 1, 100),
    });

    body.object.castShadow = true;
    body.object.receiveShadow = true;
    body.object.setRotationFromEuler(new Euler(0, Math.PI / 2, 0));
    body.object.position.set(0, -0.5, 0);
    this.addComponent(body);

    // Debug Box
    const boxMap = texture.loadTexture('/textures/debug/orange/texture_01.png');
    boxMap.wrapS = boxMap.wrapT = RepeatWrapping;
    boxMap.repeat.set(5, 5);
    const box = new StaticBodyComponent({
      name: 'DebugBox',
      material: new MeshBasicMaterial({
        map: boxMap,
      }),
      geometry: new BoxGeometry(5, 5, 5),
    });

    box.object.castShadow = true;
    box.object.receiveShadow = true;
    box.object.position.set(25, 2.5, 20);
    this.addComponent(box);

    // Import test - Tower
    const tower = new StaticBodyComponent({
      name: 'Tower',
      object: await manager.loadGLTFModel('/models/tower/tower.gltf'),
    });
    tower.object.scale.multiplyScalar(5);
    tower.object.position.y = 9.0;
    // tower.object.children[0].visible = false; // visualizer
    // tower.object.children[1].visible = false; // collider

    this.addComponent(tower);
  }
}

export class PlayGroundLevel extends BaseLevel {
  constructor() {
    super();
    this.backgroundColor = 0x263238 / 2;
  }

  async ready() {
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
    this.addGameEntity(new Ground());
  }
}
