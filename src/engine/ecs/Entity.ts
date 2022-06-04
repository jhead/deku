import { Component, ComponentName } from '.'
import { Point } from '../../types/Geom'
import { DiscreteMotionComponent, ObjectComponent, PositionComponent } from './systems'
import '../../types/ext'

export type Entity = {
  readonly type: 'Entity'
  readonly id: string
  readonly components: Component[]
}

export namespace Entity {
  export const getComponent = <T extends Component>(
    entity: Entity,
    componentName: ComponentName<T>
  ): T[] =>
    entity.components.filterInstanceOf(
      (comp) => comp.componentName === componentName
    )

  export type BaseProps = {
    obj: ObjectComponent
    pos: PositionComponent
  }

  export class Base implements Entity {
    readonly type: 'Entity'
    readonly id: string = `${globalEntityCount++}`
    readonly components: Component[] = []

    constructor({ obj, pos = defaultPosition }: BaseProps) {
      this.components.push(obj, pos)
    }
  }

  export type RigidProps = BaseProps & {
    motion: DiscreteMotionComponent
  }

  export class Rigid extends Base {
    constructor({ obj, pos, motion }: RigidProps) {
      super({ obj, pos })
      this.components.push(motion)
    }
  }
}

// TODO
let globalEntityCount = 0

const defaultPosition: PositionComponent = {
  type: 'Component',
  componentName: 'Position',
  position: Point.Zero,
}
