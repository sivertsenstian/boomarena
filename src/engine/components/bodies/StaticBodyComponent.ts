import { BodyComponent, BodyOptions, ComponentType } from '@/engine';

export class StaticBodyComponent extends BodyComponent {
  constructor(options: BodyOptions) {
    super(ComponentType.StaticBody, options);
  }
}
