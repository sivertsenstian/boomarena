import { BaseEntity, ComponentType, IWorld, IWorldUpdate, ModelComponent } from '@/engine';

export abstract class BaseSystem implements IWorldUpdate {
  protected readonly _entities: BaseEntity[];

  protected readonly _processed: boolean[];

  protected constructor() {
    this._entities = [];
    this._processed = [];
  }

  protected register(world: IWorld, markAsProcessed: boolean, ...types: ComponentType[]) {
    // Register entities
    types.forEach((type) => {
      world.level
        .getWithComponent(type)
        .filter((e) => !this._entities?.[e.id])
        .forEach((e) => {
          this._entities[e.id] = e;
          this._processed[e.id] = markAsProcessed;
        });
    });
  }

  public update(world: IWorld, _delta: number) {}

  public processed() {
    return this._entities.filter((e) => this._processed?.[e.id]);
  }

  public unprocessed() {
    return this._entities.filter((e) => !this._processed?.[e.id]);
  }

  public initialize(init: (entity: BaseEntity) => void) {
    this.unprocessed().forEach((entity) => {
      init(entity);
      this._processed[entity.id] = true;
    });
  }

  public process(update: (entity: BaseEntity) => void) {
    this.processed().forEach((entity) => {
      update(entity);
    });
  }
}
