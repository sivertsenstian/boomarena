import { BaseComponent } from '@/engine';
import { ComponentType } from './types';
import { BufferGeometry, Material, Mesh } from 'three';

export class StaticBodyComponent extends BaseComponent {
  public object: Mesh;

  constructor(material: Material, geometry: BufferGeometry, name?: string) {
    super(ComponentType.StaticBody, name);

    this.object = new Mesh(geometry, material);
  }
}
