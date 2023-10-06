import _filter from 'lodash-es/filter';
import _has from 'lodash-es/has';
import { IInput } from './types';
import { Vector2 } from 'three';

export class InputManager {
  private static instance: InputManager;

  private readonly _inputs: { [key: string]: IInput };

  private _active: { [key: string]: IInput };

  private constructor() {
    this._inputs = {};
    this._active = {};

    window.onkeydown = (event) => {
      _filter(
        this._inputs,
        (i) => i.events.filter((e) => e.toLowerCase() === event.code.toLowerCase()).length > 0,
      ).forEach((active) => {
        if (!_has(this._active, active.name)) {
          this._active[active.name] = active;
          active.isPressed = true;
        }
      });
    };

    window.onkeyup = (event) => {
      _filter(
        this._inputs,
        (i) => i.events.filter((e) => e.toLowerCase() === event.code.toLowerCase()).length > 0,
      ).forEach((active) => {
        delete this._active[active.name];
        active.isPressed = false;
      });
    };

    window.onblur = (_event) => {
      this._active = {};
    };
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }

    return InputManager.instance;
  }

  public add(...inputs: IInput[]) {
    inputs.forEach((input) => {
      if (_has(this._inputs, input.name)) {
        throw Error(`${input.name} already registered!`);
      }
      this._inputs[input.name] = input;
    });
  }

  public remove(input: IInput) {
    if (_has(this._inputs, input.name)) {
      delete this._inputs[input.name];
    }
  }

  public getDirection(
    negativeX: string,
    positiveX: string,
    positiveY: string,
    negativeY: string,
  ): Vector2 {
    const nx = this._active?.[negativeX]?.isPressed ? -1.0 : 0;
    const px = this._active?.[positiveX]?.isPressed ? 1.0 : 0;
    const ny = this._active?.[negativeY]?.isPressed ? 1.0 : 0;
    const py = this._active?.[positiveY]?.isPressed ? -1.0 : 0;
    return new Vector2(nx + px, ny + py).normalize();
  }
}
