import { ColorRepresentation, PointLight } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export class PointLightComponent extends BaseComponent {
  public object: PointLight;

  constructor(name?: string, color: ColorRepresentation = 0xffffff, intensity = 1.0) {
    super(ComponentType.Light, name);

    this.object = new PointLight(color, intensity);
  }
}
