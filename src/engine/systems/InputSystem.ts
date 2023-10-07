import _filter from 'lodash-es/filter';

import { InputManager, IWorldUpdate } from '@/engine';
import { World } from '@/game';
import { ISystem } from './types';

export class InputSystem implements ISystem, IWorldUpdate {
  private _input: InputManager;

  constructor() {
    this._input = InputManager.getInstance();
  }

  public update(world: World, _delta: number) {
    const events = this._input.getEvents();
    if (events.length > 0) {
      _filter(world.level.entities, 'processingInputEvents').forEach((entity) =>
        events.map((e) => entity.processInput(e)),
      );
    }
  }
}
