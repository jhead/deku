import { Component, Entity, Point, System, TickContext } from '../..'
import { updatedDiff } from 'deep-object-diff'

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

// TODO: move to something more centralized on the ctx?
const entityStates: Record<string, EntityState> = {}
type EntityState = {
  position: Point
}

export const PhysicsSystem: System = {
  name: 'Physics',

  process(ctx: TickContext, entity: Entity) {
    const [pos] = Entity.getComponent<PositionComponent>(
      entity,
      PositionComponentName
    )
    if (!pos) return

    const [motion] = Entity.getComponent<DiscreteMotionComponent>(
      entity,
      DiscreteMotionComponentName
    )

    if (motion) {
      pos.position = {
        x: pos.position.x + motion.velocity.x,
        y: pos.position.y + motion.velocity.y
      }
    }

    // TODO: move state diff and events out
    const newState: EntityState = {
      position: { ...pos.position },
    }

    const stateDiff: Partial<EntityState> = updatedDiff(
      entityStates[entity.id],
      newState
    )

    if ('position' in stateDiff) {
      ctx.api.transform({
        id: entity.id,
        position: stateDiff.position 
      })
    }

    entityStates[entity.id] = newState
  },
}
