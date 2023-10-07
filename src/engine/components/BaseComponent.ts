import _uniqueId from 'lodash-es/uniqueId';
import { Object3D } from 'three';

export enum ComponentType {
  Area,
  AudioPlayer,
  Camera,
  CharacterBody,
  CollisionShape,
  Light,
  RayCast,
  RigidBody,
  StaticBody,
  Decal,
  Controls,
}

export interface IComponent {
  id: string;
  name: string;
  object?: Object3D;
  type: ComponentType;
}

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
