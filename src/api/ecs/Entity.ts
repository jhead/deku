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
  ): T[] => (getComponentCache(entity)[component.name] || []) as T[]

  export const withComponent =
    <T extends Component, R>(entity: Entity, component: ComponentRef<T>) =>
    (block: (component: T) => R): R | null => {
      const comp = getComponent(entity, component)
      if (comp) return block(comp)
      return null
    }

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

type ComponentCache = Record<string, Component[]>
const componentCaches: WeakMap<Entity, ComponentCache> = new WeakMap()

const getComponentCache = (entity: Entity): ComponentCache => {
  const existing = componentCaches.get(entity)
  if (existing) return existing

  const map: ComponentCache = entity.components.reduce((map, comp) => {
    const list = map[comp.componentName] || []
    const res = {
      ...map,
      [comp.componentName]: [list, comp].flat(),
    }

    return res
  }, {})

  componentCaches.set(entity, map)
  return map
}
