import { BaseSystem, ComponentType, Constants, IWorldUpdate, TransformComponent } from '@/engine';
import { World } from '@/game';
import { AnimationComponent, AnimationType } from '@/engine/components/AnimationComponent';

export class AnimationSystem extends BaseSystem implements IWorldUpdate {
  constructor() {
    super();
  }

  public update(world: World, delta: number) {
    super.register(world, true, ComponentType.Animation);
    this.process((entity) => {
      const animation = entity.get<AnimationComponent>(ComponentType.Animation);
      animation.animations
        .filter((a) => !a.completed)
        .forEach((a) => {
          switch (a.type) {
            case AnimationType.Rotation: {
              const c = entity.get<TransformComponent>(ComponentType.Transform);
              c.rotation?.addScaledVector(a.value ?? Constants.ZeroVector, delta);
              a.completed =
                a.duration === 'single' ||
                (a.duration === 'custom' && a.elapsed! >= a.seconds! * 1000);
              a.elapsed! += delta;
              break;
            }
            case AnimationType.Position: {
              const c = entity.get<TransformComponent>(ComponentType.Transform);
              c.translation?.addScaledVector(a.value ?? Constants.ZeroVector, delta);
              a.completed =
                a.duration === 'single' ||
                (a.duration === 'custom' && a.elapsed! >= a.seconds! * 1000);
              a.elapsed! += delta;
              break;
            }
            case AnimationType.Scale: {
              const c = entity.get<TransformComponent>(ComponentType.Transform);
              c.scale?.addScaledVector(a.value ?? Constants.ZeroVector, delta);
              a.completed =
                a.duration === 'single' ||
                (a.duration === 'custom' && a.elapsed! >= a.seconds! * 1000);
              a.elapsed! += delta;
              break;
            }
            case AnimationType.KeyFrame: {
              return new Error('AnimationType.KeyFrame - not yet supported');
            }
          }
        });
    });
  }
}
