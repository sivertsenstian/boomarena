import { World } from '@/game';

export interface ISystem {
  update(world: World, delta: number): void;
}

export interface IMessage {
  id: string;
}
