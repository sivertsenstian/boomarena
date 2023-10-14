import { Camera, PerspectiveCamera } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export class CameraComponent extends BaseComponent {
  public instance: Camera;

  public isActive: boolean;

  constructor(
    isActive = false,
    fov: number = 75,
    aspect: number = 16.0 / 9.0,
    near = 0.1,
    far = 5000,
  ) {
    super(ComponentType.Camera);
    this.instance = new PerspectiveCamera(fov, aspect, near, far);
    this.isActive = isActive;
  }
}
