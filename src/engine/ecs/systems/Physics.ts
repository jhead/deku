import { updatedDiff } from 'deep-object-diff'
import {
  DiscreteMotionComponent,
  DiscreteMotionComponentName,
  PositionComponent,
  PositionComponentName,
} from '../../../api/builtin/Physics'
import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'
import { ComponentDelta } from '../../../api/event/EngineEventAPI'
import { Point } from '../../../api/types/Geom'

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
      PositionComponentName,
    )
    if (!pos) return

    // TODO: don't update entities outside viewport
    if (pos.position.x >= 800 || pos.position.y >= 600) return
    
    const [motion] = Entity.getComponent<DiscreteMotionComponent>(
      entity,
      DiscreteMotionComponentName,
    )

    if (motion) {
      pos.position = {
        x: pos.position.x + motion.velocity.x,
        y: pos.position.y + motion.velocity.y,
      }
    }

    // TODO: move state diff and events out
    const newState: EntityState = {
      position: { ...pos.position },
    }

    const stateDiff: Partial<EntityState> = updatedDiff(
      entityStates[entity.id],
      newState,
    )

    const delta: ComponentDelta[] = []

    if ('position' in stateDiff) {
      delta.push(<ComponentDelta<PositionComponent>>{
        componentName: PositionComponentName,
        position: stateDiff.position,
      })
    }

    ctx.api.emit({
      type: 'EntityUpdate',
      id: entity.id,
      delta,
    })

    entityStates[entity.id] = newState
  },
}
