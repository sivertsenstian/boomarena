import { BaseSystem, ComponentType, InputComponent, IWorldUpdate } from '@/engine';
import { World } from '@/game';

export class InputSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  public update(world: World, delta: number) {
    super.register(world, true, ComponentType.Input);
    this.process((entity) => {
      const input = entity.get<InputComponent>(ComponentType.Input);
      input.processInput(delta);
    });
  }
}
