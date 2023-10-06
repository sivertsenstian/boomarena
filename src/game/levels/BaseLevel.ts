import { Scene } from 'three';
import _has from 'lodash-es/has';

import { BaseEntity } from '@/engine';

export class BaseLevel extends Scene {
  private readonly _entities: { [key: string]: BaseEntity };

  get entities(): { [key: string]: BaseEntity } {
    return this._entities;
  }

  constructor() {
    super();
    this._entities = {};
  }

  public ready() {}

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
