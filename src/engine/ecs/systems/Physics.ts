import { updatedDiff } from 'deep-object-diff'
import {
  DiscreteMotionComponent,
  PositionComponent,
} from '../../../api/builtin/Physics'
import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'
import { ComponentDelta } from '../../../api/event/EngineEventAPI'
import { Point } from '../../../api/types/Geom'

// TODO: move to something more centralized on the ctx?
const entityStates: WeakMap<Entity, EntityState> = new WeakMap()

type EntityState = {
  position: Point
}

export const PhysicsSystem: System = {
  name: 'Physics',

  process(ctx: TickContext, entity: Entity) {
    const pos = Entity.getComponent(entity, PositionComponent)
    if (!pos) return

    // TODO: do this properly
    if (
      entity.id !== 'Pointer' &&
      (pos.position?.x >= 800 || pos.position?.y >= 600)
    ) {
      ctx.api.emit({
        type: 'CullEntity',
        id: entity.id,
      })
      delete ctx.entities[entity.id]
      return
    }

    const motion = Entity.getComponent(entity, DiscreteMotionComponent)

    if (motion) {
      pos.position = {
        x: pos.position.x + motion.velocity.x,
        y: pos.position.y + motion.velocity.y,
      }
    }

    const isNewEntity = !entityStates.has(entity)

    // TODO: move state diff and events out
    const newState: EntityState = {
      position: { ...pos.position },
    }

    const stateDiff: Partial<EntityState> = updatedDiff(
      entityStates.get(entity),
      newState,
    )

    const delta: ComponentDelta[] = []

    if (isNewEntity || 'position' in stateDiff) {
      delta.push(<ComponentDelta<PositionComponent>>{
        componentName: 'Position',
        position: stateDiff.position,
      })
    }

    ctx.api.emit({
      type: 'EntityUpdate',
      id: entity.id,
      delta,
    })

    entityStates.set(entity, newState)
  },
}
