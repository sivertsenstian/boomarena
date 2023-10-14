import _isNil from 'lodash-es/isNil';
import { BufferGeometry, Material, Mesh } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

interface IModelOptions {}

interface IObjectModelOptions extends IModelOptions {
  object: Mesh;
  material?: never;
  geometry?: never;
  children?: never;
}

interface IGeometryModelOptions extends IModelOptions {
  object?: never;
  material: Material | Material[];
  geometry: BufferGeometry;
}

export type ModelOptions = IObjectModelOptions | IGeometryModelOptions;

export class ModelComponent extends BaseComponent {
  public instance: Mesh;

  constructor({ material, geometry, object }: ModelOptions) {
    super(ComponentType.Model);

    if (_isNil(object)) {
      this.instance = new Mesh(geometry, material);
    } else {
      this.instance = object;
    }

    this.instance.castShadow = true;
    this.instance.receiveShadow = true;
  }
}
