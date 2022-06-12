import { DiscreteMotionComponent, PositionComponent } from '../builtin/Physics'
import { RenderComponent } from '../builtin/Render'
import { Point } from '../types/Geom'
import { Component, ComponentRef } from './Component'

export type Entity = {
  readonly type: 'Entity'
  readonly id: string
  readonly components: Component[]
  readonly immortal?: boolean
}

export namespace Entity {
  export const getComponent = <T extends Component>(
    entity: Entity,
    component: ComponentRef<T>,
  ): T => getComponents(entity, component)[0]

  export const getComponents = <T extends Component>(
    entity: Entity,
    component: ComponentRef<T>,
  ): T[] =>
    entity.components.filterInstanceOf(
      (comp) => comp.componentName === component.name,
    )

  export const withComponent =
    <T extends Component, R>(entity: Entity, component: ComponentRef<T>) =>
    (block: (component: T) => R): R | null =>
      getComponents<T>(entity, component).slice(0, 1).map(block)[0]

  export type BaseProps = {
    obj: RenderComponent
    pos: PositionComponent
  }

  export abstract class Base implements Entity {
    readonly type: 'Entity'
    readonly id: string
    readonly components: Component[] = []

    constructor({ obj, pos = defaultPosition }: BaseProps) {
      this.components.push(obj, pos)
    }
  }

  export type RigidProps = BaseProps & {
    motion: DiscreteMotionComponent
  }

  export abstract class Rigid extends Base {
    constructor({ obj, pos, motion }: RigidProps) {
      super({ obj, pos })
      this.components.push(motion)
    }
  }
}

// Re-export
export const getComponent = Entity.getComponent
export const getComponents = Entity.getComponents
export const withComponent = Entity.withComponent

const defaultPosition: PositionComponent = {
  type: 'Component',
  componentName: 'Position',
  position: Point.Zero,
}
