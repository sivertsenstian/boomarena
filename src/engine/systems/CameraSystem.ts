import { Camera } from 'three';

import {
  BaseEntity,
  BaseSystem,
  CameraComponent,
  ComponentType,
  IWorldUpdate,
  TargetComponent,
  TransformComponent,
} from '@/engine';
import { World } from '@/game';

export class CameraSystem extends BaseSystem implements IWorldUpdate {
  public active?: BaseEntity;

  constructor() {
    super();
  }

  public update(world: World, _delta: number) {
    super.register(world, false, ComponentType.Camera);
    // Get all camera components registered - set the first isActive camera found as active
    this.initialize((entity) => {
      const camera = entity.get<CameraComponent>(ComponentType.Camera);
      if (camera.isActive) {
        this.active = entity;

        // Set camera transform if it exists
        if (entity.has(ComponentType.Transform)) {
          const transform = entity.get<TransformComponent>(ComponentType.Transform);
          if (transform.translation) {
            camera.instance.position.set(...transform.translation.toArray());
          }
          if (transform.rotation) {
            camera.instance.rotation.set(...transform.rotation.toArray());
          }
        }

        // Set camera target if it exists
        if (entity.has(ComponentType.Target)) {
          const target = entity.get<TargetComponent>(ComponentType.Target);
          camera.instance.lookAt(target.position);
        }

        // Add camera to world - only if entity does not have a world model representation
        if (!entity.has(ComponentType.Model)) {
          world.level.add(camera.instance);
        }
      }
    });

    // TODO: Default to first camera found if no isActive cameras
    // if (_isNil(this.active)) {
    //   this.active = _first(this._entities);
    // }
  }

  public getActive(): Camera {
    if (this.active === undefined || !this.active.has(ComponentType.Camera)) {
      throw Error('No active camera defined in the camera system - critical failure!');
    }
    return this.active.get<CameraComponent>(ComponentType.Camera).instance;
  }
}
