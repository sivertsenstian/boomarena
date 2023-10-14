import { BaseSystem, ComponentType, GUIManager, IWorld, IWorldUpdate } from '@/engine';
import { ColorRepresentation, PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
import _forEach from 'lodash-es/forEach';
import _isNil from 'lodash-es/isNil';

export class RenderingSystem extends BaseSystem implements IWorldUpdate {
  private readonly _renderer: WebGLRenderer;

  private readonly _added: { [key: string]: boolean };

  public getRenderer() {
    return this._renderer;
  }

  constructor(scalar: number, clearColor: ColorRepresentation = 0x000000) {
    super();

    this._added = {};

    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('World');
    folder.add(this, 'requestPointerLock');

    this._renderer = new WebGLRenderer({ antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth * scalar, window.innerHeight * scalar);
    this._renderer.setClearColor(clearColor, 1);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.outputColorSpace = SRGBColorSpace;

    // Renderer DOM ELEMENT
    this._renderer.domElement.style.margin = 'auto';
    this._renderer.domElement.style.marginTop = String(window.innerHeight * scalar * 0.15);
    this._renderer.domElement.style.border = '1px solid whitesmoke';
    this._renderer.domElement.style.boxShadow = '5px 3px 3px rgba(0,0,0,0.2)';

    document.body.style.backgroundImage = 'linear-gradient(180deg, #252525, #404040)';
    document.body.appendChild(this._renderer.domElement);

    window.onresize = () => {
      this._renderer.setSize(window.innerWidth * scalar, window.innerHeight * scalar);
      this._renderer.domElement.style.marginTop = String(window.innerHeight * scalar * 0.15);
    };
  }

  update(world: IWorld, _delta: number): void {
    const types = [ComponentType.CharacterBody, ComponentType.StaticBody, ComponentType.Light];
    super.register(world, ...types);

    // Process all entities
    _forEach(this._entities, (entity) => {
      if (!this._added?.[entity.id]) {
        types.forEach((type) => {
          this._added[entity.id] = true;
          entity
            .getComponentsByType(type)
            .filter((c) => !_isNil(c.object))
            .forEach((c) => world.level.add(c.object!));
        });
      }
    });
  }

  public stop() {
    this._renderer.setAnimationLoop(null);
  }

  private async requestPointerLock() {
    await this._renderer.domElement.requestPointerLock();
  }
}
