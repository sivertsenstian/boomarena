import _has from 'lodash-es/has';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class ModelManager {
  private static instance: ModelManager;

  private readonly _gltfModelLoader;

  private readonly _models: { [path: string]: unknown };

  private constructor() {
    this._models = {};

    this._gltfModelLoader = new GLTFLoader();
  }

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }

    return ModelManager.instance;
  }

  public loadGLTFModel(path: string) {
    if (_has(this._models, path)) {
      return this._models[path];
    }

    // Cache model in collection for faster re-fetch and re-use
    const model = this._gltfModelLoader.load(path);
    this._models[path] = model;
    return model;
  }
}
