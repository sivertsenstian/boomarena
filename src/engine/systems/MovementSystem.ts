import _flatMap from 'lodash-es/flatMap';

import { ComponentType, GUIManager, IWorldUpdate, StaticBodyComponent } from '@/engine';
import { World } from '@/game';

export class MovementSystem implements IWorldUpdate {
  public showCollisions = true;

  public showVisualizers = true;

  constructor() {
    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('CollisionSystem');
    folder.add(this, 'showCollisions');
    folder.add(this, 'showVisualizers');
  }

  public update(world: World, _delta: number) {
    const components: StaticBodyComponent[] = _flatMap(world.level.entities, (e) =>
      e.getComponentsByType(ComponentType.StaticBody),
    );
  }
}
