import { ColorRepresentation, PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';

import {
  BaseSystem,
  ComponentType,
  GUIManager,
  IWorld,
  IWorldUpdate,
  ModelComponent,
} from '@/engine';

export class RenderingSystem extends BaseSystem implements IWorldUpdate {
  private readonly _renderer: WebGLRenderer;

  public getRenderer() {
    return this._renderer;
  }

  constructor(scalar: number, clearColor: ColorRepresentation = 0x000000) {
    super();

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
    super.register(world, false, ComponentType.Model);
    this.initialize((entity) => {
      const model = entity.get<ModelComponent>(ComponentType.Model);
      world.level.add(model.instance);
    });
  }

  public stop() {
    this._renderer.setAnimationLoop(null);
  }

  private async requestPointerLock() {
    await this._renderer.domElement.requestPointerLock();
  }
}
