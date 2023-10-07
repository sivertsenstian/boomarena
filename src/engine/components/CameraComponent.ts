import { Camera, PerspectiveCamera } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export class CameraComponent extends BaseComponent {
  public instance: Camera;

  public isCurrent: boolean = false;

  constructor(
    name?: string,
    fov: number = 75,
    aspect: number = 16.0 / 9.0,
    near = 0.5,
    far = 5000,
  ) {
    super(ComponentType.Camera, name);

    this.instance = new PerspectiveCamera(fov, aspect, near, far);
  }
}
