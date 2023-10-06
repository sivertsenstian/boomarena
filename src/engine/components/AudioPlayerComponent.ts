import { ComponentType } from './types';
import { BaseComponent } from '@/engine';

export class AudioPlayerComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.AudioPlayer, name);
  }
}
