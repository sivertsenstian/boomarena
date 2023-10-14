import {
  CameraSystem,
  CollisionSystem,
  Input,
  InputManager,
  InputSystem,
  IReady,
  IWorld,
  LightSystem,
  PhysicsSystem,
  RenderingSystem,
  StatsSystem,
  AnimationSystem,
} from '@/engine';
import { BaseLevel } from '@/game';
import { TransformSystem } from '@/engine/systems/TransformSystem';

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
    const stats = new StatsSystem();
    const rendering = new RenderingSystem(0.8, this.level.backgroundColor);
    const camera = new CameraSystem();
    const input = new InputSystem();
    const collisions = new CollisionSystem();
    const transforms = new TransformSystem();
    const lights = new LightSystem();
    const animations = new AnimationSystem();

    rendering.getRenderer().setAnimationLoop((currentDelta) => {
      stats.update(currentDelta);

      const elapsed = currentDelta - this._previousDelta;
      if (elapsed > this._interval) {
        // Run systems
        input.update(this, elapsed);

        collisions.update(this, elapsed);

        transforms.update(this, elapsed);
        animations.update(this, elapsed);

        this._physicsSystem.update(this, elapsed);

        camera.update(this, elapsed);

        lights.update(this, elapsed);
        rendering.update(this, elapsed);

        this._previousDelta = currentDelta;
        rendering.getRenderer().render(this.level, camera.getActive());
      }
    });
  }

  stop = (): void => {
    // renderingSystem.stop();
  };
}
