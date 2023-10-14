import { BaseComponent, ComponentType, IComponent } from '@/engine';

export class InputComponent extends BaseComponent {
  public processInput: (delta: number) => void;

  constructor(processInput: (delta: number) => void) {
    super(ComponentType.Input);
    this.processInput = processInput;
  }
}
