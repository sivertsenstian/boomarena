import _isEmpty from 'lodash-es/isEmpty';
import _isNil from 'lodash-es/isNil';
import { BufferGeometry, Material, Mesh, Object3D } from 'three';

import { BaseComponent, ComponentType } from '@/engine';

interface IBodyOptions {
  name?: string;
}

interface IObjectBodyOptions extends IBodyOptions {
  object: Object3D;
  material?: never;
  geometry?: never;
  children?: never;
}

interface IGeometryBodyOptions extends IBodyOptions {
  object?: never;
  material: Material | Material[];
  geometry: BufferGeometry;
}

export type BodyOptions = IObjectBodyOptions | IGeometryBodyOptions;

export abstract class BodyComponent extends BaseComponent {
  public object: Object3D;

  public isStatic: boolean;

  protected constructor(type: ComponentType, { name, material, geometry, object }: BodyOptions) {
    super(type, name);

    if (_isNil(object)) {
      this.object = new Mesh(geometry, material);
    } else {
      this.object = object;
    }

    this.object.castShadow = true;
    this.object.receiveShadow = true;
    this.isStatic = true;
  }
}
