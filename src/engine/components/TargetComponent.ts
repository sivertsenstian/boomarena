import { Vector3 } from 'three';
import { BaseComponent, ComponentType } from '@/engine';

export class TargetComponent extends BaseComponent {
  public position;

  constructor(position = new Vector3()) {
    super(ComponentType.Target);
    this.position = position;
  }
}
