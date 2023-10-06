import _forEach from 'lodash-es/forEach';
import { WebGLRenderer } from 'three';
import Stats from 'stats.js';

import { CameraSystem, InputManager } from '@/engine';
import { BaseLevel } from './levels';
import { Input } from '@/engine/Input';

export class World {
  private _interval: number = 1000 / 60; // 60 fps

  private _previousDelta: number = 0;

  private _stats: Stats;

  public level: BaseLevel;

  public renderer: WebGLRenderer;

  constructor(width: number, height: number, level: BaseLevel) {
    this.level = level;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.margin = 'auto';
    this.renderer.domElement.style.marginTop = String(height * 0.15);
    this.renderer.domElement.style.border = '5px solid gray';
    this.renderer.domElement.style.boxShadow = '5px 3px 3px rgba(0,0,0,0.2)';

    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);
  }

  init() {
    document.body.style.backgroundColor = 'dimgray';
    document.body.appendChild(this.renderer.domElement);

    // Register basic inputs
    const inputSystem = InputManager.getInstance();

    const left = new Input('left', ['KeyA', 'ArrowLeft']);
    const right = new Input('right', ['KeyD', 'ArrowRight']);
    const up = new Input('up', ['KeyW', 'ArrowUp']);
    const down = new Input('down', ['KeyS', 'ArrowDown']);
    inputSystem.add(left, right, up, down);

    // initialize level
    this.level.ready();

    // initialize all entities in level
    _forEach(this.level.entities, (e) => e.ready());
  }

  start() {
    const cameraSystem = new CameraSystem();

    this.renderer.setAnimationLoop((currentDelta) => {
      this._stats.begin();
      const elapsed = currentDelta - this._previousDelta;
      if (elapsed > this._interval) {
        // Run systems
        cameraSystem.update(this, elapsed);

        _forEach(this.level.entities, (e) => e.update(elapsed));

        this._previousDelta = currentDelta;
        this.renderer.render(this.level, cameraSystem.getCurrent());
      }
      this._stats.end();
    });
  }

  stop = () => this.renderer.setAnimationLoop(null);
}
