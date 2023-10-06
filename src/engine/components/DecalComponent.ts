import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class DecalComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.Decal, name);
  }
}
