import { IProcessInput, IReady, IUpdate } from '@/engine';
import { BaseEntity } from '@/engine/entities/BaseEntity';
export abstract class UserControlledEntity
  extends BaseEntity
  implements IReady, IUpdate, IProcessInput
{
  protected constructor(name?: string) {
    super(name);
    this.processingInputEvents = true;
  }
}
