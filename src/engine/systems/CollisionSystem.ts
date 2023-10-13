import { GUIManager, IWorldUpdate } from '@/engine';
import { World } from '@/game';

export class CollisionSystem implements IWorldUpdate {
  public showCollisions = true;

  public _collisions: [];

  constructor() {
    this._collisions = [];

    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('CollisionSystem');
    folder.add(this, 'showCollisions');
  }

  public update(world: World, _delta: number) {}
}
