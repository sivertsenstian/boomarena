import { BaseComponent, ComponentType } from '@/engine';

export class AudioPlayerComponent extends BaseComponent {
  constructor(name?: string) {
    super(ComponentType.AudioPlayer, name);
  }
}
