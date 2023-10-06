import { DirectionalLight } from 'three';

import { BaseComponent } from '@/engine';
import { ComponentType } from '../types';

export class DirectionalLightComponent extends BaseComponent {
  public object: DirectionalLight;

  constructor(name?: string) {
    super(ComponentType.Light, name);

    this.object = new DirectionalLight(0xffffff);
  }
}
