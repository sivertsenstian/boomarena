import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class AreaComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.Area, name);
  }
}
