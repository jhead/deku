import { ObjectComponent } from '.'
import { Component, Entity, System, TickContext } from '..'
import { Point } from '../../../types/Geom'

export type PositionComponent = Component & {
  componentName: 'Position'
  position: Point
}

export type DiscreteMotionComponent = Component & {
  componentName: 'DiscreteMotion'
  velocity: Point
}

export const PhysicsSystem: System = {
  process(ctx: TickContext, entity: Entity) {
    const [pos] = Entity.getComponent<PositionComponent>(entity, 'Position')
    if (!pos) return

    const [obj] = Entity.getComponent<ObjectComponent>(entity, 'Object')
    if (!obj) return

    const [motion] = Entity.getComponent<DiscreteMotionComponent>(
      entity,
      'DiscreteMotion'
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
