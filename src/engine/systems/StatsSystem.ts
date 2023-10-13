import Stats from 'stats.js';
import { IUpdate } from '@/engine';

export class StatsSystem implements IUpdate {
  private readonly _stats: Stats;

  constructor() {
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);
  }

  public update(_delta: number) {
    this._stats.update();
  }
}
