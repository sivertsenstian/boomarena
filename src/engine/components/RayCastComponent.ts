import { BaseComponent, ComponentType } from '@/engine';

export class RayCastComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.RayCast, name);
  }
}
