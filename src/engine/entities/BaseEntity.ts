import _uniqueId from 'lodash-es/uniqueId';

import { ComponentType, IComponent, IReady } from '@/engine';
import _isNil from 'lodash-es/isNil';

let id = 0;

export class BaseEntity implements IReady {
  public readonly components: { [key: number]: IComponent };

  public readonly id: number;

  public readonly name: string;

  public constructor() {
    this.id = id++;
    this.name = _uniqueId(`${this.constructor.name}_`);
    this.components = {};
  }

  public async ready() {}

  public add(...components: IComponent[]) {
    components.forEach((component) => {
      if (_isNil(component.type)) {
        throw Error(`Unable to add component ${component} with type ${component.type}`);
      }

      this.components[component.type] = component;
    });
  }

  public remove(component: IComponent) {
    delete this.components?.[component.type];
  }

  public has(type: ComponentType) {
    return this.components?.[type] !== undefined;
  }

  public get<T extends IComponent>(type: ComponentType): T {
    return this.components?.[type] as T;
  }

  public toString() {
    return `ENTITY//${this.id}//${this.name}`;
  }
}
