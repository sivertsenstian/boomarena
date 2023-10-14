import _has from 'lodash-es/has';

import {
  Box3,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3D,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MeshBVH, StaticGeometryGenerator } from 'three-mesh-bvh';

export class ModelManager {
  private static instance: ModelManager;

  private readonly _gltfModelLoader;

  private readonly _models: { [path: string]: Mesh };

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

  private createCollider(geometry: BufferGeometry<NormalBufferAttributes>): Mesh {
    const collider = new Mesh(geometry);
    (collider.material as MeshBasicMaterial).color.set(0xffffff);
    (collider.material as MeshBasicMaterial).wireframe = true;
    (collider.material as MeshBasicMaterial).wireframeLinewidth = 5.0;
    (collider.material as MeshBasicMaterial).opacity = 1.0;
    (collider.material as MeshBasicMaterial).transparent = true;
    return collider;
  }

  private mergeGeometry(object: Object3D): BufferGeometry<NormalBufferAttributes> {
    const generator = new StaticGeometryGenerator(object);
    generator.attributes = ['position'];
    const geometry = generator.generate();
    geometry.boundsTree = new MeshBVH(geometry);
    return geometry;
  }

  public loadGLTFModel(path: string): Promise<Mesh> {
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
              newGeom.scale(7, 7, 7);
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

          const staticGenerator = new StaticGeometryGenerator(environment);
          staticGenerator.attributes = ['position'];

          const mergedGeometry = staticGenerator.generate();
          // mergedGeometry.scale(7, 7, 7);
          mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);

          const collider = new Mesh(mergedGeometry);
          // collider.material.wireframe = true;
          // collider.material.opacity = 0.5;
          // collider.material.transparent = true;

          //const visualizer = new MeshBVHVisualizer(collider, params.visualizeDepth);

          // console.log(collider);

          resolve(collider as Mesh);
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
