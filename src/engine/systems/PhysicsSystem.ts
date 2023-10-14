import _has from 'lodash-es/has';
import {
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3D,
  SphereGeometry,
  Vector3,
} from 'three';
import RAPIER, {
  World as RapierWorld,
  ColliderDesc,
  Quaternion,
  RigidBody,
  RigidBodyDesc,
} from '@dimforge/rapier3d';

import { World } from '@/game';
import {
  BaseSystem,
  BodyComponent,
  ComponentType,
  GUIManager,
  IWorldReady,
  IWorldUpdate,
  StaticBodyComponent,
} from '@/engine';
import { MeshBVH, StaticGeometryGenerator } from 'three-mesh-bvh';
import _forEach from 'lodash-es/forEach';
import _isNil from 'lodash-es/isNil';

export class PhysicsSystem extends BaseSystem implements IWorldReady, IWorldUpdate {
  private _physics?: RapierWorld;
  private _gravity = new Vector3(0, -9.81, 0);
  private lines?: LineSegments;
  private readonly _added: { [key: string]: boolean };

  public showPhysics = true;
  private rigidBody?: RigidBody;
  private sphere?: Mesh;

  constructor() {
    super();

    this._added = {};
    const gui = GUIManager.getInstance();
    const folder = gui.addFolder('PhysicsSystem');
    folder.add(this, 'showPhysics');
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

  public async ready(world: World) {
    await RAPIER;

    // let gravity = new Vector3(0, -9.81, 0);

    // Test
    // const geometry = new SphereGeometry(1, 32, 16);
    // const material = new MeshStandardMaterial({ color: 0xffffff });
    // this.sphere = new Mesh(geometry, material);
    // this.sphere.castShadow = true;
    // world.level.add(this.sphere);

    // Physics
    // let groundColliderDesc = ColliderDesc.cuboid(50.0, 0.5, 50.0);
    // groundColliderDesc.rotation.y = Math.PI / 2.0;
    // groundColliderDesc.setRotation(new Quaternion(0.7071, 0, 0.7071, 0));
    // groundColliderDesc.setTranslation(0, -0.5, 0);
    // groundColliderDesc.setRotation(new Quaternion(1.0, 0.2, 0, 0));
    // this._physics.createCollider(groundColliderDesc);
    //
    // let rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(0.0, 15.0, 0.0).setCcdEnabled(true);
    // //
    // this.rigidBody = this._physics.createRigidBody(rigidBodyDesc);
    // this.rigidBody.setLinvel(new Vector3(10, 0, 10), true);
    //
    // this.sphere.geometry.computeBoundingBox();
    // this.sphere.geometry.computeBoundingSphere();
    //
    // this.sphere.geometry.computeBoundingSphere();
    // const boundingS = this.sphere.geometry.boundingSphere;
    // const boundingB = this.sphere.geometry.boundingBox;
    // console.log({
    //   tree: this.sphere.geometry.boundsTree,
    //   box: this.sphere.geometry.boundingBox,
    //   sphere: this.sphere.geometry.boundingSphere,
    // });
    //
    // let colliderDesc = ColliderDesc.ball(boundingS!.radius);
    // let colliderDesc = RAPIER.ColliderDesc.cuboid(...boundingB?.max.toArray());
    // let colliderDesc = RAPIER.ColliderDesc.trimesh(
    //   this.sphere.geometry.getAttribute('position')?.array as any,
    //   this.sphere.geometry.getIndex()?.array as any,
    // );
    // let collider = this._physics.createCollider(colliderDesc, this.rigidBody);
  }

  public update(world: World, delta: number) {
    if (this._physics) {
      // DEBUG
      if (!this.lines) {
        let material = new LineBasicMaterial({
          color: 0xffffff,
          vertexColors: true,
        });
        let geometry = new BufferGeometry();
        this.lines = new LineSegments(geometry, material);
        world.level.add(this.lines);
      }

      let buffers = this._physics!.debugRender();
      this.lines.geometry.setAttribute('position', new BufferAttribute(buffers.vertices, 3));
      this.lines.geometry.setAttribute('color', new BufferAttribute(buffers.colors, 4));
      // END DEBUG

      const types = [ComponentType.CharacterBody, ComponentType.StaticBody];
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

      // const components: StaticBodyComponent[] = _flatMap(world.level.entities, (e) =>
      //   e.getComponentsByType(ComponentType.StaticBody),
      // );

      // components
      //   .filter((c) => !_has(this._registered, c.id))
      //   .forEach((c) => {
      //     const geometry = this.mergeGeometry(c.object);
      //     const collision = this.createCollider(geometry);
      //     collision.geometry.computeBoundingBox();
      //     const bounds = (c.object as Mesh)?.geometry?.boundingBox?.max;
      //     if (bounds) {
      //       let colliderDesc = ColliderDesc.cuboid(bounds.x, bounds.y, bounds.z).setTranslation(
      //         c.object.position.x,
      //         c.object.position.y,
      //         c.object.position.z,
      //       );
      //       this._physics?.createCollider(colliderDesc);
      //       this._registered[c.id] = c;
      //     }
      //   });

      this._physics.step();

      // const pos = this.rigidBody?.translation();
      // if (pos) {
      //   this.sphere?.position.set(pos.x, pos.y, pos.z);
      // }
    } else {
      this._physics = new RapierWorld(this._gravity);
    }
  }
}
