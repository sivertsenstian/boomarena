import { World } from '@/game';
import { IMessage, ISystem } from './types';
import { IWorldUpdate } from '@/engine';

export class MessageSystem implements ISystem, IWorldUpdate {
  private readonly _messages: IMessage[];

  constructor() {
    this._messages = [];
  }

  public update(world: World, delta: number) {}

  public add(message: IMessage) {
    this._messages.push(message);
  }
}
