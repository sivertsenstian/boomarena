import _uniqueId from 'lodash-es/uniqueId';
import { ComponentType, IComponent } from './types';
import { Object3D } from 'three';

export abstract class BaseComponent implements IComponent {
  public readonly id: string;

  public readonly name: string;

  public readonly type: ComponentType;

  public readonly object?: Object3D;

  protected constructor(type: ComponentType, name?: string) {
    this.id = _uniqueId('boom_component_');
    this.name = name ?? _uniqueId(`__${this.constructor.name}`);
    this.type = type;
  }
}
