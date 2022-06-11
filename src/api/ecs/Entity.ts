import { DiscreteMotionComponent, PositionComponent } from '../builtin/Physics'
import { RenderComponent } from '../builtin/Render'
import { Point } from '../types/Geom'
import { Component, ComponentName } from './Component'

export type Entity = {
  readonly type: 'Entity'
  readonly id: string
  readonly components: Component[]
}
export namespace Entity {
  export const getComponent = <T extends Component>(
    entity: Entity,
    componentName: ComponentName<T>,
  ): T[] =>
    entity.components.filterInstanceOf(
      (comp) => comp.componentName === componentName,
    )

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

const defaultPosition: PositionComponent = {
  type: 'Component',
  componentName: 'Position',
  position: Point.Zero,
}
