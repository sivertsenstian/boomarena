import { ColorRepresentation, Scene } from 'three';
import _has from 'lodash-es/has';

import { BaseEntity, ComponentType, IComponent, IReady } from '@/engine';
import _flatMap from 'lodash-es/flatMap';
import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';

export class BaseLevel extends Scene implements IReady {
  private readonly _entities: { [key: string]: BaseEntity };

  public backgroundColor: ColorRepresentation = 0xffffff;

  get entities(): { [key: string]: BaseEntity } {
    return this._entities;
  }

  constructor() {
    super();
    this._entities = {};
  }

  public async ready() {
    await Promise.all(_map(this.entities, (e) => e.ready()));
  }

  public addGameEntity(entity: BaseEntity) {
    this._entities[entity.id] = entity;
  }

  public removeGameEntity(entity: BaseEntity) {
    if (_has(this._entities, entity.id)) {
      delete this._entities[entity.id];
    }
  }

  public getEntitiesWithComponent(type: ComponentType): BaseEntity[] {
    return _filter(this.entities, (e) => e.hasComponentWithType(type));
  }

  public getComponents<T extends IComponent>(type: ComponentType): T[] {
    return _flatMap(this.entities, (e) => e.getComponentsByType<T>(type));
  }
}
