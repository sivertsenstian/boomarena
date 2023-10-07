import { BaseComponent, ComponentType } from '@/engine';

export class AreaComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.Area, name);
  }
}
