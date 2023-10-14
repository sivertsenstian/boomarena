import { Vector3 } from 'three';
import { BaseComponent, ComponentType } from '@/engine';

export class MovementComponent extends BaseComponent {
  public position = new Vector3();

  public speed = 0;

  constructor(name?: string) {
    super(ComponentType.Movement, name);
  }
}
