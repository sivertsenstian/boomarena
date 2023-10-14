import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments, Vector3 } from 'three';
import RAPIER, { ColliderDesc, RigidBodyDesc, World as RapierWorld } from '@dimforge/rapier3d';

import { World } from '@/game';
import {
  BaseSystem,
  BodyComponent,
  BodyType,
  ComponentType,
  GUIManager,
  IWorldReady,
  IWorldUpdate,
  ModelComponent,
  TransformComponent,
} from '@/engine';

export class PhysicsSystem extends BaseSystem implements IWorldReady, IWorldUpdate {
  private _physics?: RapierWorld;
  private _gravity = new Vector3(0, -9.81, 0);
  private lines?: LineSegments;

  public showPhysics = true;

  constructor() {
    super();

    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('PhysicsSystem');
    folder.add(this, 'showPhysics');
  }

  public async ready(world: World) {
    await RAPIER;
    // this._physics = new RapierWorld(this._gravity);
  }

  public update(world: World, delta: number) {
    if (this._physics) {
      super.register(world, false, ComponentType.Body);

      this.initialize((entity) => {
        const body = entity.get<BodyComponent>(ComponentType.Body);
        const transform = entity.get<TransformComponent>(ComponentType.Transform);
        switch (body.bodyType) {
          case BodyType.Character: {
            const model = entity.get<ModelComponent>(ComponentType.Model);
            model.instance.geometry.computeBoundingBox();
            model.instance.geometry.computeBoundingSphere();

            const box = model.instance.geometry.boundingBox?.max;
            const sphere = model.instance.geometry.boundingSphere;
            if (box && sphere) {
              const controller = this._physics?.createCharacterController(0.01);
              const rigidBodyDesc = RigidBodyDesc.dynamic();
              const rigidBody = this._physics?.createRigidBody(rigidBodyDesc);

              const colliderDesc = ColliderDesc.capsule(box?.y, sphere.radius);
              const collider = this._physics?.createCollider(colliderDesc, rigidBody);

              body.controller = controller;
              body.collider = collider;
              body.instance = rigidBody;
              // Set initial translation
              if (transform.translation) {
                body.instance?.setTranslation(transform.translation, false);
              }
            }
            break;
          }
          case BodyType.Rigid: {
            const model = entity.get<ModelComponent>(ComponentType.Model);
            model.instance.geometry.computeBoundingBox();
            model.instance.geometry.computeBoundingSphere();

            const box = model.instance.geometry.boundingBox?.max;
            if (box) {
              const rigidBodyDesc = RigidBodyDesc.dynamic();
              const rigidBody = this._physics?.createRigidBody(rigidBodyDesc);

              const colliderDesc = ColliderDesc.cuboid(box.x, box.y, box.z);
              body.collider = this._physics?.createCollider(colliderDesc, rigidBody);
              body.instance = rigidBody;
              // Set initial translation
              if (transform.translation) {
                body.instance?.setTranslation(transform.translation, false);
              }
            }
            break;
          }
          case BodyType.Static: {
            const model = entity.get<ModelComponent>(ComponentType.Model);
            model.instance.geometry.computeBoundingBox();

            const box = model.instance.geometry.boundingBox?.max;
            if (box) {
              // const colliderDesc = ColliderDesc.cuboid(box.x, box.y, box.z);
              // console.log([box, tree?.geometry.boundingBox]);
              // const colliderDesc = ColliderDesc.trimesh(
              //   model.instance.geometry.getAttribute('position')?.array as any,
              //   model.instance.geometry.getIndex()?.array as any,
              // );
              // : ColliderDesc.cuboid(box.x, box.y, box.z);
              const colliderDesc = ColliderDesc.cuboid(box.x, box.y, box.z);
              body.collider = this._physics?.createCollider(colliderDesc);
              // Set initial translation
              if (transform.translation) {
                body.collider?.setTranslation(transform.translation);
              }
            }
            break;
          }
          default:
            new Error(`${BodyType[body.bodyType]} - not yet supported`);
        }
      });

      // DEBUG
      if (!this.lines) {
        let material = new LineBasicMaterial({
          color: 0xffffff,
          vertexColors: true,
          depthTest: false,
        });
        let geometry = new BufferGeometry();
        this.lines = new LineSegments(geometry, material);
        this.lines.renderOrder = 999;
        world.level.add(this.lines);
      }

      let buffers = this._physics.debugRender();
      this.lines.geometry.setAttribute('position', new BufferAttribute(buffers.vertices, 3));
      this.lines.geometry.setAttribute('color', new BufferAttribute(buffers.colors, 4));
      // END DEBUG
      this._physics.step();
    } else {
      this._physics = new RapierWorld(this._gravity);
      // throw Error('No physics available - critical error');
    }
  }
}
