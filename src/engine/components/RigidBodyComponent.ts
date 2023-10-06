import { BufferGeometry, Material, Mesh } from 'three';

import { BaseComponent } from '@/engine';
import { ComponentType } from './types';

export class RigidBodyComponent extends BaseComponent {
  public object: Mesh;

  constructor(material: Material | Material[], geometry: BufferGeometry, name?: string) {
    super(ComponentType.RigidBody, name);

    this.object = new Mesh(geometry, material);
  }
}
