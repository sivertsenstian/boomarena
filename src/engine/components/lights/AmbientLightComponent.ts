import { AmbientLight, ColorRepresentation } from 'three';

import { LightComponent } from '@/engine';

export class AmbientLightComponent extends LightComponent {
  public instance: AmbientLight;

  constructor(color: ColorRepresentation = 0x404040, intensity = 1.0) {
    super();

    this.instance = new AmbientLight(color, intensity);
  }
}
