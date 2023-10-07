import { BaseComponent, ComponentType } from '@/engine';

export class DecalComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.Decal, name);
  }
}
