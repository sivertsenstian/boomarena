import _map from 'lodash-es/map';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _some from 'lodash-es/some';
import _uniqueId from 'lodash-es/uniqueId';

import { AxesHelper, Object3D } from 'three';

import { ComponentType, IComponent, InputEvent, IProcessInput, IReady, IUpdate } from '@/engine';
export abstract class BaseEntity extends Object3D implements IReady, IUpdate, IProcessInput {
  private readonly _components: { [key: string]: IComponent };

  public processingInputEvents: boolean = false;

  protected constructor(name?: string) {
    super();
    this.name = name ?? _uniqueId(`__${this.constructor.name}`);
    this._components = {};
  }

  public async ready() {}

  public update(_delta: number) {}

  processInput(event: InputEvent) {}

  public addComponent(component: IComponent) {
    this._components[component.id] = component;

    if (component.object !== undefined) {
      this.add(component.object);
    }
  }

  public removeComponent(component: IComponent) {
    delete this._components?.[component.id];
  }

  public hasComponentWithType(type: ComponentType) {
    return _some(this._components, (x) => x.type === type);
  }

  public getComponentsByType<T extends IComponent>(type: ComponentType) {
    return _filter(this._components, (x) => x.type === type) as T[];
  }

  public getComponentByType<T extends IComponent>(type: ComponentType): T {
    return _find(this._components, (x) => x.type === type) as T;
  }

  public getComponentById<T extends IComponent>(id: string) {
    return this._components?.[id] as T;
  }

  public getComponent<T extends IComponent>(name: string): T {
    const found = _find(this._components, (x) => x.name.toLowerCase() === name.toLowerCase()) as T;
    if (!found) {
      throw Error(
        `Component with name ${name} not found for entity ${this.name}, found: ${_map(
          this._components,
          (c) => c.name,
        )}`,
      );
    }
    return found;
  }
}
