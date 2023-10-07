import { BodyComponent, BodyOptions, ComponentType } from '@/engine';

export class CharacterBodyComponent extends BodyComponent {
  constructor(options: BodyOptions) {
    super(ComponentType.CharacterBody, options);
  }
}
