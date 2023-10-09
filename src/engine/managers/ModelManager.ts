import _has from 'lodash-es/has';

import { Box3, Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class ModelManager {
  private static instance: ModelManager;

  private readonly _gltfModelLoader;

  private readonly _models: { [path: string]: Object3D };

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

  public loadGLTFModel(path: string): Promise<Object3D> {
    return new Promise((resolve, reject) => {
      if (_has(this._models, path)) {
        resolve(this._models[path]);
      }

      this._gltfModelLoader.load(
        path,
        (gltf) => {
          let environment: Group;

          const gltfScene = gltf.scene as any;

          const box = new Box3();
          box.setFromObject(gltfScene);
          box.getCenter(gltfScene.position).negate();
          gltfScene.updateMatrixWorld(true);

          // visual geometry setup
          const toMerge = {} as any;
          gltfScene.traverse((c: any) => {
            if (c.isMesh) {
              const hex = c.material.color.getHex();
              toMerge[hex] = toMerge[hex] || [];
              toMerge[hex].push(c);
            }
          });

          environment = new Group();
          for (const hex in toMerge) {
            const arr = toMerge[hex];
            const visualGeometries: any[] = [];
            arr.forEach((mesh: any) => {
              if (mesh.material.emissive.r !== 0) {
                environment.attach(mesh);
              } else {
                const geom = mesh.geometry.clone();
                geom.applyMatrix4(mesh.matrixWorld);
                visualGeometries.push(geom);
              }
            });

            if (visualGeometries.length) {
              const newGeom = BufferGeometryUtils.mergeGeometries(visualGeometries);
              const newMesh = new Mesh(
                newGeom,
                new MeshStandardMaterial({ color: parseInt(hex), shadowSide: 2 }),
              );
              newMesh.castShadow = true;
              newMesh.receiveShadow = true;
              newMesh.material.shadowSide = 2;

              environment.add(newMesh);
            }
          }

          resolve(environment);
        },
        undefined,
        (error) => reject(error),
      );
    });
  }

  public getModel(path: string) {
    return this._models[path];
  }
}
