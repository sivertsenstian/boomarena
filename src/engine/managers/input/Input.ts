import _uniqueId from 'lodash-es/uniqueId';
import { InputEvent } from '@/engine';

export interface IInput {
  id: string;
  name: string;
  events: string[];
  input?: InputEvent;
}

export class Input implements IInput {
  public id: string;

  public name: string;

  public events: string[];

  public input?: InputEvent;

  constructor(name: string, events: string[] = []) {
    this.id = _uniqueId('boom_input_');
    this.name = name;
    this.events = events;
  }
}
