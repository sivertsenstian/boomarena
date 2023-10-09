import _has from 'lodash-es/has';

import { CubeTextureLoader, Texture, TextureLoader } from 'three';

export class TextureManager {
  private static instance: TextureManager;

  private readonly _textureLoader;

  private readonly _cubeTextureLoader;

  private readonly _textures: { [path: string]: Texture };

  private constructor() {
    this._textures = {};

    this._textureLoader = new TextureLoader();
    this._cubeTextureLoader = new CubeTextureLoader();
  }

  public static getInstance(): TextureManager {
    if (!TextureManager.instance) {
      TextureManager.instance = new TextureManager();
    }

    return TextureManager.instance;
  }

  public loadTexture(path: string) {
    if (_has(this._textures, path)) {
      return this._textures[path];
    }

    // Cache texture in collection for faster re-fetch and re-use
    const texture = this._textureLoader.load(path);
    this._textures[path] = texture;
    return texture;
  }

  public loadTextures(paths: string[]) {
    return paths.map(this.loadTexture);
  }

  public loadCubeTexture(path: string, sides: string[]) {
    const p = path.endsWith('/') ? path : `${path}/`;
    if (_has(this._textures, p)) {
      return this._textures[p];
    }

    // Cache texture in collection for faster re-fetch and re-use
    const texture = this._cubeTextureLoader.setPath(p).load(sides);
    this._textures[p] = texture;
    return texture;
  }
}
