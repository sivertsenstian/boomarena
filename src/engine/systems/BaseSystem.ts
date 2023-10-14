import { BaseEntity, ComponentType, IWorld, IWorldUpdate } from '@/engine';
import _has from 'lodash-es/has';

export abstract class BaseSystem implements IWorldUpdate {
  protected readonly _entities: { [key: string]: BaseEntity };

  protected constructor() {
    this._entities = {};
  }

  protected register(world: IWorld, ...types: ComponentType[]) {
    // Register entities
    types.forEach((type) => {
      world.level
        .getEntitiesWithComponent(type)
        .filter((e) => !_has(this._entities, e.id))
        .forEach((e) => {
          console.log(`${this.constructor.name} - registered: ${e.id}//${e.name}`);
          this._entities[e.id] = e;
        });
    });
  }

  public update(world: IWorld, _delta: number) {}
}
