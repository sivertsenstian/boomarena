import { Vector3 } from 'three';
import { BaseComponent, ComponentType } from '@/engine';

export class VelocityComponent extends BaseComponent {
  public velocity = new Vector3();
  public speed = 0;

  constructor() {
    super(ComponentType.Velocity);
  }
}
