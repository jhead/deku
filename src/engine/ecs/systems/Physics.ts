import { RenderComponent } from '.'
import { Component, Entity, System, TickContext } from '..'
import { Point } from '../../../types/Geom'
import { RenderComponentName } from './Render'

export const PositionComponentName = 'Position'
export type PositionComponent = Component & {
  componentName: typeof PositionComponentName
  position: Point
}

export const DiscreteMotionComponentName = 'DiscreteMotion'
export type DiscreteMotionComponent = Component & {
  componentName: typeof DiscreteMotionComponentName
  velocity: Point
}

export const PhysicsSystem: System = {
  name: 'Physics',

  process(ctx: TickContext, entity: Entity) {
    const [pos] = Entity.getComponent<PositionComponent>(
      entity,
      PositionComponentName
    )
    if (!pos) return

    const [obj] = Entity.getComponent<RenderComponent>(
      entity,
      RenderComponentName
    )
    if (!obj) return

    const [motion] = Entity.getComponent<DiscreteMotionComponent>(
      entity,
      DiscreteMotionComponentName
    )

    if (motion) {
      ctx.api.transform({
        id: entity.id,
        positionDelta: {
          x: motion.velocity.x,
          y: motion.velocity.y,
        },
      })
    } else {
      ctx.api.transform({
        id: entity.id,
        position: pos.position,
      })
    }
  },
}
