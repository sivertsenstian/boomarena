import { AmbientLight } from 'three';

import { BaseComponent } from '@/engine';
import { ComponentType } from '../types';

export class AmbientLightComponent extends BaseComponent {
  public object: AmbientLight;

  constructor(name?: string) {
    super(ComponentType.Light, name);

    this.object = new AmbientLight(0x404040);
  }
}
