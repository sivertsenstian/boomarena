import { AmbientLight, ColorRepresentation } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export class AmbientLightComponent extends BaseComponent {
  public object: AmbientLight;

  constructor(name?: string, color: ColorRepresentation = 0x404040, intensity = 1.0) {
    super(ComponentType.Light, name);

    this.object = new AmbientLight(color, intensity);
  }
}
