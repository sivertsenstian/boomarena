import { ColorRepresentation, DirectionalLight } from 'three';

import { BaseComponent, ComponentType } from "@/engine";

export class DirectionalLightComponent extends BaseComponent {
  public object: DirectionalLight;

  constructor(name?: string, color: ColorRepresentation = 0xffffff, intensity = 1.0) {
    super(ComponentType.Light, name);

    this.object = new DirectionalLight(color, intensity);
  }
}
