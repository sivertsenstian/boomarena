import _first from 'lodash-es/first';
import { Camera } from 'three';

import { BaseSystem, CameraComponent, ComponentType, IWorldUpdate } from '@/engine';
import { World } from '@/game';
import _flatMap from 'lodash-es/flatMap';

export class CameraSystem extends BaseSystem implements IWorldUpdate {
  public current?: Camera;

  constructor() {
    super();
  }

  public update(world: World, _delta: number) {
    super.register(world, ComponentType.Camera);

    // Get all camera components registered
    const components = _flatMap(this._entities, (e) =>
      e.getComponentsByType<CameraComponent>(ComponentType.Camera),
    );

    // Use the first camera found that is set to isCurrent - otherwise default to first camera found
    this.current = components.find((c) => c.isCurrent)?.instance ?? _first(components)?.instance;
  }

  public getCurrent(): Camera {
    if (this.current === undefined) {
      throw Error('No camera defined in the camera system - critical failure!');
    }
    return this.current;
  }
}
