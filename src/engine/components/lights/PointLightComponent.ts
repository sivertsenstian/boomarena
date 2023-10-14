import { ColorRepresentation, PointLight } from 'three';

import { LightComponent } from '@/engine';

export class PointLightComponent extends LightComponent {
  public instance: PointLight;

  constructor(color: ColorRepresentation = 0xffffff, intensity = 1.0) {
    super();
    this.instance = new PointLight(color, intensity);
  }
}
