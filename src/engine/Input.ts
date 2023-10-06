import _uniqueId from 'lodash-es/uniqueId';

import { IInput } from '@/engine/systems';

export class Input implements IInput {
  public id: string;

  public name: string;

  public events: string[];

  public isPressed: boolean = false;

  constructor(name: string, events: string[] = []) {
    this.id = _uniqueId('boom_input_');
    this.name = name;
    this.events = events;
  }
}
