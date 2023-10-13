import { ColorRepresentation, Scene } from 'three';
import _has from 'lodash-es/has';

import { BaseEntity, IReady } from '@/engine';
import _forEach from 'lodash-es/forEach';

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
    console.log('LEVEL READY!');
    console.log(this.entities);

    _forEach(this.entities, async (e) => {
      await e.ready();
      console.log(`${e.name} is ready!`);
    });
  }

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
