import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class CollisionShapeComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.CollisionShape, name);
  }
}
