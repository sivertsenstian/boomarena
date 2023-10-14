import { Vector3 } from 'three';
import { BaseComponent, ComponentType } from '@/engine';

export enum AnimationType {
  Position,
  Rotation,
  KeyFrame,
  Scale,
}

export type AnimationDuration = 'single' | 'continuous' | 'custom';

export interface IAnimationDescription {
  type: AnimationType;
  value?: Vector3;
  name?: string;
  duration: AnimationDuration;
  seconds?: number;
  elapsed?: number;
  completed?: boolean;
}

export class AnimationComponent extends BaseComponent {
  public animations: IAnimationDescription[];

  constructor(animations: IAnimationDescription[]) {
    super(ComponentType.Animation);
    this.animations = animations.map((a) => {
      a.completed ??= false;
      a.seconds ??= 0;
      a.elapsed ??= 0;
      return a;
    });
  }
}
