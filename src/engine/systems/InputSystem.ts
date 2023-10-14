import { BaseSystem, ComponentType, InputComponent, IWorldUpdate } from '@/engine';
import { World } from '@/game';
import _forEach from 'lodash-es/forEach';

export class InputSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  public update(world: World, delta: number) {
    super.register(world, ComponentType.Input);

    // Process registered input events
    _forEach(this._entities, (e) => {
      const input = e.getComponentByType<InputComponent>(ComponentType.Input);
      input.processInput(delta);
    });
  }
}
