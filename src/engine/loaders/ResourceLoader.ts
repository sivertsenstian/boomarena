import _has from 'lodash-es/has';

import { Texture, TextureLoader } from 'three';

export class ResourceLoader {
  private readonly _basePath: string;

  private readonly _textureLoader;

  private readonly _textures: { [path: string]: Texture };

  constructor(path: string = '') {
    this._basePath = path;
    this._textures = {};

    this._textureLoader = new TextureLoader();
  }

  loadTexture = (path: string) => {
    if (_has(this._textures, path)) {
      return this._textureLoader.load(path);
    }

    // Cache texture in collection for faster re-fetch and re-use
    const texture = this._textureLoader.load(path);
    this._textures[path] = texture;
    return texture;
  };

  loadTextures = (paths: string[]) => {
    return paths.map(this.loadTexture);
  };
}
