import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class RayCastComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.RayCast, name);
  }
}
