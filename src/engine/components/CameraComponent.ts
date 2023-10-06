import { Camera, PerspectiveCamera } from 'three';

import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class CameraComponent extends BaseComponent {
  public object: Camera;

  public isCurrent: boolean = false;

  constructor(
    name?: string,
    fov: number = 75,
    aspect: number = 16.0 / 9.0,
    near = 0.1,
    far = 2000,
  ) {
    super(ComponentType.Camera, name);

    this.object = new PerspectiveCamera(fov, aspect, near, far);
  }
}
