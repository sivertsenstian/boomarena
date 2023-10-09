import _forEach from 'lodash-es/forEach';
import { PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
import Stats from 'stats.js';

import {
  CameraSystem,
  CollisionSystem,
  Input,
  InputManager,
  InputSystem,
  IReady,
  IWorld,
} from '@/engine';
import { BaseLevel } from './levels';

export class World implements IWorld, IReady {
  private _interval: number = 1000 / 60; // 60 fps

  private _previousDelta: number = 0;

  private _stats: Stats;

  public level: BaseLevel;

  public renderer: WebGLRenderer;

  constructor(scalar: number, level: BaseLevel) {
    this.level = level;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth * scalar, window.innerHeight * scalar);
    this.renderer.setClearColor(level.backgroundColor, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.outputColorSpace = SRGBColorSpace;

    // Renderer DOM ELEMENT
    this.renderer.domElement.style.margin = 'auto';
    this.renderer.domElement.style.marginTop = String(window.innerHeight * scalar * 0.15);
    this.renderer.domElement.style.border = '1px solid whitesmoke';
    this.renderer.domElement.style.boxShadow = '5px 3px 3px rgba(0,0,0,0.2)';

    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    document.body.style.backgroundImage = 'linear-gradient(180deg, #252525, #404040)';
    document.body.appendChild(this.renderer.domElement);

    window.onresize = () => {
      this.renderer.setSize(window.innerWidth * scalar, window.innerHeight * scalar);
      this.renderer.domElement.style.marginTop = String(window.innerHeight * scalar * 0.15);
    };
  }

  async ready() {
    // Register basic inputs
    const inputManager = InputManager.getInstance();

    const left = new Input('left', ['KeyA', 'ArrowLeft']);
    const right = new Input('right', ['KeyD', 'ArrowRight']);
    const up = new Input('up', ['KeyW', 'ArrowUp']);
    const down = new Input('down', ['KeyS', 'ArrowDown']);
    const shoot = new Input('shoot', ['MouseButtonLeft', 'Enter']);
    const jump = new Input('jump', ['Space', 'MouseButtonRight']);
    const crouch = new Input('crouch', ['ShiftLeft', 'ShiftRight', 'KeyZ', 'MouseButtonMiddle']);
    const zoomIn = new Input('zoomIn', ['MouseWheelForward']);
    const zoomOut = new Input('zoomOut', ['MouseWheelBack']);
    const look = new Input('look', ['MouseMove']);

    inputManager.add(left, right, up, down, jump, crouch, shoot, zoomIn, zoomOut, look);

    // initialize level
    await this.level.ready();

    // initialize all entities in level
    _forEach(this.level.entities, (e) => e.ready());

    // const result = await this.renderer.domElement.requestPointerLock();
    this.renderer.domElement.addEventListener('click', async () => {
      this.renderer.domElement.requestPointerLock();
    });
  }

  start() {
    const cameraSystem = new CameraSystem();
    const inputSystem = new InputSystem();
    const collisionSystem = new CollisionSystem();

    this.renderer.setAnimationLoop((currentDelta) => {
      this._stats.update();

      const elapsed = currentDelta - this._previousDelta;
      if (elapsed > this._interval) {
        // Run systems
        cameraSystem.update(this, elapsed);
        inputSystem.update(this, elapsed);
        collisionSystem.update(this, elapsed);

        _forEach(this.level.entities, (e) => e.update(elapsed));

        this._previousDelta = currentDelta;
        this.renderer.render(this.level, cameraSystem.getCurrent());
      }
    });
  }

  stop = () => this.renderer.setAnimationLoop(null);
}
