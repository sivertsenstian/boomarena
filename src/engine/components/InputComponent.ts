import { BaseComponent, ComponentType } from '@/engine';

export class InputComponent extends BaseComponent {
  public processInput: (delta: number) => void;

  constructor(name: string, processInput: (delta: number) => void) {
    super(ComponentType.Input, name);
    this.processInput = processInput;
  }
}
