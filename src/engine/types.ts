import { WebGLRenderer } from 'three';

import { InputEvent } from '@/engine';
import { BaseLevel } from '@/game';

export interface IReady {
  ready(): Promise<void>;
}

export interface IUpdate {
  update(delta: number): void;
}

export interface IWorldUpdate {
  update(world: IWorld, delta: number): void;
}

export interface IWorld {
  level: BaseLevel;

  renderer: WebGLRenderer;

  start(): void;

  stop(): void;
}

export interface IProcessInput {
  processInput(event: InputEvent): void;
}
