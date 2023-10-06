import GUI from 'lil-gui';

export class GUIManager {
  private static instance: GUI;

  private readonly _gui: { [key: string]: any };

  private constructor() {
    this._gui = {};
  }

  public static getInstance(): GUI {
    if (!GUIManager.instance) {
      GUIManager.instance = new GUI();
    }

    return GUIManager.instance;
  }
}
