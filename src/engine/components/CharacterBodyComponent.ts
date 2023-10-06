import { ComponentType } from './types';

import { BaseComponent } from '@/engine';
import { BufferGeometry, Material, Mesh } from 'three';

export class CharacterBodyComponent extends BaseComponent {
  public object: Mesh;

  constructor(name: string, material: Material, geometry: BufferGeometry) {
    super(ComponentType.CharacterBody, name);

    this.object = new Mesh(geometry, material);
  }
}
