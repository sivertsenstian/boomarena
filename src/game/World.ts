import {
  CameraSystem,
  CollisionSystem,
  Input,
  InputManager,
  InputSystem,
  IReady,
  IWorld,
  PhysicsSystem,
  StatsSystem,
} from '@/engine';
import { BaseLevel } from './levels';
import { RenderingSystem } from '@/engine/systems/RenderingSystem';
import { MovementSystem } from '@/engine/systems/MovementSystem';

export class World implements IWorld, IReady {
  private _interval: number = 1000 / 60; // 60 fps

  private _previousDelta: number = 0;

  public level: BaseLevel;

  private _physicsSystem: PhysicsSystem = new PhysicsSystem();

  constructor(level: BaseLevel) {
    this.level = level;
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

    // Initialize systems
    await this._physicsSystem.ready(this);
  }

  start() {
    const statsSystem = new StatsSystem();
    const renderingSystem = new RenderingSystem(0.8, this.level.backgroundColor);
    const cameraSystem = new CameraSystem();
    const inputSystem = new InputSystem();
    const collisionSystem = new CollisionSystem();
    const movementSystem = new MovementSystem();

    renderingSystem.getRenderer().setAnimationLoop((currentDelta) => {
      statsSystem.update(currentDelta);

      const elapsed = currentDelta - this._previousDelta;
      if (elapsed > this._interval) {
        // Run systems
        renderingSystem.update(this, elapsed);
        cameraSystem.update(this, elapsed);
        inputSystem.update(this, elapsed);
        collisionSystem.update(this, elapsed);
        this._physicsSystem.update(this, elapsed);
        movementSystem.update(this, elapsed);

        this._previousDelta = currentDelta;
        renderingSystem.getRenderer().render(this.level, cameraSystem.getCurrent());
      }
    });
  }

  stop = (): void => {
    // renderingSystem.stop();
  };
}
