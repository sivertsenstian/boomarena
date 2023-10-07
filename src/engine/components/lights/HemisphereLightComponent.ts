import { ColorRepresentation, HemisphereLight } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export class HemisphereLightComponent extends BaseComponent {
  public object: HemisphereLight;

  constructor(
    name: string,
    ground: ColorRepresentation = 0xffffff,
    sky: ColorRepresentation = 0x223344,
    intensity = 0.4,
  ) {
    super(ComponentType.Light, name);
    this.object = new HemisphereLight(sky, ground, intensity);
  }
}
