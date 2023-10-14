import {
  AmbientLight,
  ColorRepresentation,
  DirectionalLight,
  HemisphereLight,
  PointLight,
} from 'three';

import { BaseComponent, ComponentType } from '@/engine';

export abstract class LightComponent extends BaseComponent {
  public abstract instance: AmbientLight | PointLight | DirectionalLight | HemisphereLight;

  protected constructor() {
    super(ComponentType.Light);
  }
}
