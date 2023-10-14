import { BaseSystem, ComponentType, IWorld, IWorldUpdate, LightComponent } from '@/engine';

export class LightSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  update(world: IWorld, _delta: number): void {
    super.register(world, false, ComponentType.Light);
    this.initialize((entity) => {
      const light = entity.get<LightComponent>(ComponentType.Light);
      world.level.add(light.instance);
    });
  }
}
