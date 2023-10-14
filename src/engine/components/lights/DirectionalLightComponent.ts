import { ColorRepresentation, DirectionalLight } from 'three';

import { LightComponent } from '@/engine';

export class DirectionalLightComponent extends LightComponent {
  public instance: DirectionalLight;

  constructor(color: ColorRepresentation = 0xffffff, intensity = 1.0) {
    super();

    this.instance = new DirectionalLight(color, intensity);
  }
}
