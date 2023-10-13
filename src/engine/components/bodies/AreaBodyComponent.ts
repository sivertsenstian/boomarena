import { BodyComponent, BodyOptions, ComponentType } from '@/engine';

export class AreaBodyComponent extends BodyComponent {
  constructor(options: BodyOptions) {
    super(ComponentType.AreaBody, options);
    this.isStatic = true;
  }
}
