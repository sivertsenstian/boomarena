import { ColorRepresentation, HemisphereLight } from 'three';

import { LightComponent } from '@/engine';

export class HemisphereLightComponent extends LightComponent {
  public instance: HemisphereLight;

  constructor(
    ground: ColorRepresentation = 0xffffff,
    sky: ColorRepresentation = 0x223344,
    intensity = 0.4,
  ) {
    super();
    this.instance = new HemisphereLight(sky, ground, intensity);
  }
}
