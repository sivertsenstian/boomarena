import _first from 'lodash-es/first';
import _filter from 'lodash-es/filter';
import { Camera } from 'three';

import { CameraComponent, ComponentType, IWorldUpdate } from '@/engine';
import { World } from '@/game';

export class CameraSystem implements IWorldUpdate {
  private _cameras: CameraComponent[];

  public current?: Camera;

  constructor() {
    this._cameras = [];
  }

  public update(world: World, _delta: number) {
    this._cameras = _filter(
      world.level.entities,
      (e) => e.getComponentsByType<CameraComponent>(ComponentType.Camera).length > 0,
    ).flatMap((e) => e.getComponentsByType<CameraComponent>(ComponentType.Camera));

    // Use the first camera found that is set to isCurrent - otherwise default to first camera found
    const component = this._cameras.find((c) => c.isCurrent) ?? _first(this._cameras);
    this.current = component?.instance;
  }

  public getCurrent(): Camera {
    if (this.current === undefined) {
      throw Error('No camera defined in the camera system - critical failure!');
    }
    return this.current;
  }
}
