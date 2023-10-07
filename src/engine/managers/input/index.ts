export * from './InputManager';
export * from './Input';

export type InputEvent = WheelEvent | PointerEvent | MouseEvent | KeyboardEvent;

export const InputEventType = {
  WheelEvent: 'wheelevent',
  PointerEvent: 'pointermove',
  MouseEvent: 'mouseevent',
  KeyboardEvent: 'keyboardevent',
};
