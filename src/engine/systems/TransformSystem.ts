import {
  BaseSystem,
  ComponentType,
  IWorldUpdate,
  ModelComponent,
  TransformComponent,
} from '@/engine';
import { World } from '@/game';

export class TransformSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  public update(world: World, delta: number) {
    super.register(world, true, ComponentType.Transform);

    this.process((entity) => {
      const transform = entity.get<TransformComponent>(ComponentType.Transform);
      const model = entity.get<ModelComponent>(ComponentType.Model);
      if (model !== undefined) {
        if (transform.translation) {
          model.instance.position.set(...transform.translation.toArray());
        }
        if (transform.rotation) {
          model.instance.rotation.set(...transform.rotation.toArray());
        }
        if (transform.scale) {
          model.instance.scale.set(...transform.scale.toArray());
        }
      }
    });
  }
}
