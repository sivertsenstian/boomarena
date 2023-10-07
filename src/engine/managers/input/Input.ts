import _uniqueId from 'lodash-es/uniqueId';

export interface IInput {
  id: string;
  name: string;
  events: string[];
}

export class Input implements IInput {
  public id: string;

  public name: string;

  public events: string[];

  constructor(name: string, events: string[] = []) {
    this.id = _uniqueId('boom_input_');
    this.name = name;
    this.events = events;
  }
}
