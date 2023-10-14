import _uniqueId from 'lodash-es/uniqueId';

export enum ComponentType {
  Camera,
  Light,
  Input,
  Body,
  Model,
  Velocity,
  Target,
  Transform,
  Animation,
  GlobalTransform,
}

export interface IComponent {
  name: string;
  type: ComponentType;
}

export abstract class BaseComponent implements IComponent {
  public readonly name: string;
  public readonly type: ComponentType;

  protected constructor(type: ComponentType) {
    this.name = _uniqueId(`${this.constructor.name}_`);
    this.type = type;
  }

  public toString() {
    return `COMPONENT//${ComponentType[this.type]}//${this.name}`;
  }
}
