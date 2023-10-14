import {
  BaseSystem,
  CharacterBodyComponent,
  ComponentType,
  IWorldUpdate,
  MovementComponent,
} from '@/engine';
import { World } from '@/game';
import _forEach from 'lodash-es/forEach';

export class MovementSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  public update(world: World, delta: number) {
    super.register(world, ComponentType.Movement);

    // Process movement for entities with a character body
    _forEach(this._entities, (entity) => {
      const movement = entity.getComponentByType<MovementComponent>(ComponentType.Movement);
      const body = entity.getComponentByType<CharacterBodyComponent>(ComponentType.CharacterBody);
      body.object.position.set(...movement.position.toArray());
      // Apply physics ??
    });
  }
}
