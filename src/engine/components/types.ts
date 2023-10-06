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
}

export interface IComponent {
  id: string;
  name: string;
  object?: Object3D;
  type: ComponentType;
}
