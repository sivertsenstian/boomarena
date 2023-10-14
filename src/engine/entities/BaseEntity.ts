import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _some from 'lodash-es/some';
import _uniqueId from 'lodash-es/uniqueId';

import { ComponentType, IComponent, IReady } from '@/engine';
export abstract class BaseEntity implements IReady {
  public readonly components: { [key: string]: IComponent };

  public id: string;

  public name: string;

  protected constructor(name?: string) {
    this.id = _uniqueId(`boom_entity_id_`);
    this.name = name ?? _uniqueId(`_unnamed_${this.constructor.name}_`);
    this.components = {};
  }

  public async ready() {}

  public addComponent(component: IComponent) {
    this.components[component.id] = component;
  }

  public removeComponent(component: IComponent) {
    delete this.components?.[component.id];
  }

  public hasComponentWithType(type: ComponentType) {
    return _some(this.components, (x) => x.type === type);
  }

  public getComponentsByType<T extends IComponent>(type: ComponentType) {
    return _filter(this.components, (x) => x.type === type) as T[];
  }

  public getComponentByType<T extends IComponent>(type: ComponentType): T {
    return _find(this.components, (x) => x.type === type) as T;
  }

  public getComponentById<T extends IComponent>(id: string) {
    return this.components?.[id] as T;
  }

  public getComponent<T extends IComponent>(name: string): T {
    const found = _find(this.components, (x) => x.name.toLowerCase() === name.toLowerCase()) as T;
    if (!found) {
      throw Error(
        `Component with name ${name} not found for entity ${this.name}, found: ${_map(
          this.components,
          (c) => c.name,
        )}`,
      );
    }
    return found;
  }
}
