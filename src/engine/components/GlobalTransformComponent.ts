import { Vector3, Quaternion } from 'three';
import { BaseComponent, ComponentType } from '@/engine';

export interface ITransformOptions {
  translation?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

export class GlobalTransformComponent extends BaseComponent {
  public translation?: Vector3;

  public rotation?: Vector3;

  public scale?: Vector3;

  public quaternion: Quaternion;

  constructor({ translation, rotation, scale }: ITransformOptions = {}) {
    super(ComponentType.GlobalTransform);
    this.translation = translation;
    this.rotation = rotation;
    this.scale = scale;
    this.quaternion = new Quaternion();
  }
}
