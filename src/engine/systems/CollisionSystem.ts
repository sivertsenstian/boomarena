import _flatMap from 'lodash-es/flatMap';
import { BufferGeometry, Mesh, MeshBasicMaterial, NormalBufferAttributes, Object3D } from 'three';
import { MeshBVH, MeshBVHVisualizer, StaticGeometryGenerator } from 'three-mesh-bvh';

import { ComponentType, GUIManager, IWorldUpdate, StaticBodyComponent } from '@/engine';
import { World } from '@/game';
import { ISystem } from './types';
import _has from 'lodash-es/has';

export class CollisionSystem implements ISystem, IWorldUpdate {
  private readonly _registered: { [key: string]: StaticBodyComponent };

  private readonly _collisions: Mesh[];

  private readonly _visualizers: MeshBVHVisualizer[];

  public showCollisions = true;

  public showVisualizers = true;

  constructor() {
    this._registered = {};
    this._collisions = [];
    this._visualizers = [];

    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('CollisionSystem');
    folder.add(this, 'showCollisions');
    folder.add(this, 'showVisualizers');
  }

  private createCollider(geometry: BufferGeometry<NormalBufferAttributes>): Mesh {
    const collider = new Mesh(geometry);
    (collider.material as MeshBasicMaterial).color.set(0xff00ff);
    (collider.material as MeshBasicMaterial).wireframe = true;
    (collider.material as MeshBasicMaterial).opacity = 0.5;
    (collider.material as MeshBasicMaterial).transparent = true;
    return collider;
  }

  private mergeGeometry(object: Object3D): BufferGeometry<NormalBufferAttributes> {
    const generator = new StaticGeometryGenerator(object);
    generator.attributes = ['position'];
    const geometry = generator.generate();
    geometry.boundsTree = new MeshBVH(geometry);
    return geometry;
  }

  public update(world: World, _delta: number) {
    _flatMap(world.level.entities, (e) => e.getComponentsByType(ComponentType.StaticBody)).forEach(
      (component) => this.add(component as StaticBodyComponent),
    );

    this._collisions.forEach((collision) => {
      collision.visible = this.showCollisions;
    });

    this._visualizers.forEach((visualization) => {
      visualization.visible = this.showVisualizers;
    });
  }

  public add(component: StaticBodyComponent): void {
    if (!_has(this._registered, component.id)) {
      this._registered[component.id] = component;

      const geometry = this.mergeGeometry(component.object);
      const collision = this.createCollider(geometry);
      const visualizer = new MeshBVHVisualizer(collision, 10);

      // Add to system
      this._collisions.push(collision);
      this._visualizers.push(visualizer);

      // Add to scene/component
      component.object.add(collision);
      component.object.add(visualizer);
    }
  }
}
