import { PointLight } from 'three';

import { BaseComponent } from '@/engine';
import { ComponentType } from '../types';

export class PointLightComponent extends BaseComponent {
  public object: PointLight;

  constructor(name?: string) {
    super(ComponentType.Light, name);

    this.object = new PointLight(0xffffff);
  }
}
