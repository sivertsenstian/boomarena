import { BaseComponent, ComponentType } from '@/engine';

export class CollisionShapeComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.CollisionShape, name);
  }
}
