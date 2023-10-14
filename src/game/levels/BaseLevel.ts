import _map from 'lodash-es/map';
import { ColorRepresentation, Scene } from 'three';

import { BaseEntity, ComponentType, IReady } from '@/engine';

export class BaseLevel extends Scene implements IReady {
  private readonly _entities: BaseEntity[];

  public backgroundColor: ColorRepresentation = 0xffffff;

  constructor() {
    super();
    this._entities = [];
  }

  public async ready() {
    await Promise.all(_map(this._entities, (e) => e.ready()));
  }

  public addEntity(...entities: BaseEntity[]) {
    entities.forEach((entity) => {
      this._entities[entity.id] = entity;
    });
  }

  public removeEntity(entity: BaseEntity) {
    delete this._entities[entity.id];
  }

  public get(): BaseEntity[] {
    return this._entities;
  }

  public getWithComponent(type: ComponentType): BaseEntity[] {
    return this._entities.filter((e) => e.has(type));
  }
}
