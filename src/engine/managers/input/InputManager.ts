import _values from 'lodash-es/values';
import _filter from 'lodash-es/filter';
import _has from 'lodash-es/has';
import { Vector3 } from 'three';
import { IInput, InputEvent } from '@/engine';

const MouseButton = ['Left', 'Middle', 'Right', 'Back', 'Forward'];

export class InputManager {
  private static instance: InputManager;

  private readonly _inputs: { [key: string]: IInput };

  private readonly _events: { [key: string]: InputEvent };

  private _active: { [key: string]: IInput };

  private constructor() {
    this._inputs = {};
    this._active = {};
    this._events = {};

    let wheelEventEndTimeout: number;
    window.onwheel = (event) => {
      const inputs = _filter(
        this._inputs,
        (i) =>
          i.events.filter((e) =>
            ['mousewheelforward', 'mousewheelback'].some((w) => w === e.toLowerCase()),
          ).length > 0,
      );

      if (inputs.length > 0) {
        clearTimeout(wheelEventEndTimeout);
        wheelEventEndTimeout = setTimeout(() => {
          inputs.forEach((active) => {
            delete this._active[active.name];
          });
        }, 1000 / 60);

        if (event.deltaY > 0) {
          inputs
            .filter((i) => i.events.filter((e) => e.toLowerCase() === 'mousewheelforward'))
            .forEach((active) => {
              this._active[active.name] = active;
            });
        } else if (event.deltaY < 0) {
          inputs
            .filter((i) => i.events.filter((e) => e.toLowerCase() === 'mousewheelback'))
            .forEach((active) => {
              this._active[active.name] = active;
            });
        }
      }
    };

    window.onmousedown = (event) => {
      _filter(
        this._inputs,
        (i) =>
          i.events.filter(
            (e) => e.toLowerCase() === `MouseButton${MouseButton[event.button]}`.toLowerCase(),
          ).length > 0,
      ).forEach((active) => {
        if (!_has(this._active, active.name)) {
          this._active[active.name] = active;
        }
      });
    };

    window.onmouseup = (event) => {
      _filter(
        this._inputs,
        (i) =>
          i.events.filter(
            (e) => e.toLowerCase() === `MouseButton${MouseButton[event.button]}`.toLowerCase(),
          ).length > 0,
      ).forEach((active) => {
        delete this._active[active.name];
      });
    };

    let pointerMoveEventEndTimeout: number;
    let pointerMoveEventTimeout: number;
    window.onpointermove = (event) => {
      // Register event as active
      clearTimeout(pointerMoveEventTimeout);
      this._events[event.type] = event;
      pointerMoveEventTimeout = setTimeout(() => {
        delete this._events[event.type];
      }, 1000 / 60);

      // Handle active registered inputs for this event
      const inputs = _filter(
        this._inputs,
        (i) => i.events.filter((e) => e.toLowerCase() === 'mousemove').length > 0,
      );

      if (inputs.length > 0) {
        clearTimeout(pointerMoveEventEndTimeout);
        pointerMoveEventEndTimeout = setTimeout(() => {
          inputs.forEach((active) => {
            delete this._active[active.name];
          });
        }, 1000 / 60);

        _filter(
          this._inputs,
          (i) => i.events.filter((e) => e.toLowerCase() === 'mousemove').length > 0,
        ).forEach((active) => {
          if (!_has(this._active, active.name)) {
            this._active[active.name] = active;
          }
        });
      }
    };

    window.onkeydown = (event) => {
      _filter(
        this._inputs,
        (i) => i.events.filter((e) => e.toLowerCase() === event.code.toLowerCase()).length > 0,
      ).forEach((active) => {
        if (!_has(this._active, active.name)) {
          this._active[active.name] = active;
        }
      });
    };

    window.onkeyup = (event) => {
      _filter(
        this._inputs,
        (i) => i.events.filter((e) => e.toLowerCase() === event.code.toLowerCase()).length > 0,
      ).forEach((active) => {
        delete this._active[active.name];
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
    positiveZ: string,
    negativeZ: string,
  ): Vector3 {
    const nx = _has(this._active, negativeX) ? -1.0 : 0;
    const px = _has(this._active, positiveX) ? 1.0 : 0;
    const pz = _has(this._active, positiveZ) ? -1.0 : 0;
    const nz = _has(this._active, negativeZ) ? 1.0 : 0;
    return new Vector3(nx + px, 0, nz + pz).normalize();
  }

  public isActionPressed(name: string) {
    return _has(this._active, name);
  }

  public getEvents() {
    return _values(this._events);
  }
}
