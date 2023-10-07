import { ColorRepresentation, Scene } from 'three';
import _has from 'lodash-es/has';

import { BaseEntity, IReady } from '@/engine';

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

  public async ready() {}

  public addGameEntity(entity: BaseEntity) {
    this._entities[entity.id] = entity;
    this.add(entity);
  }

  public removeGameEntity(entity: BaseEntity) {
    if (_has(this._entities, entity.id)) {
      delete this._entities[entity.id];
      this.remove(entity);
    }
  }
}
