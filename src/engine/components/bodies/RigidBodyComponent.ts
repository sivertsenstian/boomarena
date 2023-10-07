import { BodyComponent, BodyOptions, ComponentType } from '@/engine';

export class RigidBodyComponent extends BodyComponent {
  constructor(options: BodyOptions) {
    super(ComponentType.RigidBody, options);
  }
}
