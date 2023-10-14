import _isNil from 'lodash-es/isNil';

import { BaseComponent, ComponentType } from '@/engine';
import { Collider, KinematicCharacterController, RigidBody } from '@dimforge/rapier3d';

interface IBodyOptions {
  isStatic?: boolean;
}

export enum BodyType {
  Static,
  Rigid,
  Character,
  Area,
}

export class BodyComponent extends BaseComponent {
  public isStatic: boolean;

  public bodyType: BodyType;

  public collider?: Collider;

  public controller?: KinematicCharacterController;

  public instance?: RigidBody;

  constructor(bodyType: BodyType, { isStatic }: IBodyOptions = {}) {
    super(ComponentType.Body);

    this.bodyType = bodyType;
    this.isStatic = _isNil(isStatic) ? true : isStatic;
  }
}
