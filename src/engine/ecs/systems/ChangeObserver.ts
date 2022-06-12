import { updatedDiff } from 'deep-object-diff'
import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'
import { ComponentDelta } from '../../../api/event/EngineEventAPI'
import cloneDeep from 'lodash.clonedeep'

type EntityState = Partial<Entity>
const entityStates: WeakMap<Entity, EntityState> = new WeakMap()

export const ChangeObserver: System = {
  name: 'ChangeObserver',
  process: function (ctx: TickContext, entity: Entity) {
    const oldState: EntityState = entityStates.get(entity)
    const newState: EntityState = cloneDeep(entity)
    const stateDiff: EntityState = updatedDiff(oldState, newState)

    const delta: ComponentDelta[] = []
    Object.entries(stateDiff.components || {}).forEach(([index, component]) => {
      delta.push(<ComponentDelta<typeof component>>{
        componentName: entity.components[index]?.componentName,
        ...component,
      })
    })

    if (delta.length > 0) {
      ctx.api.emit({
        type: 'EntityUpdate',
        id: entity.id,
        delta,
      })
    }

    entityStates.set(entity, newState)
  },
}
