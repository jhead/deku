import { PositionComponent } from '../../../api/builtin/Physics'
import { Entity, getComponent } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'

export const Reaper: System = {
  name: 'Reaper',
  process(ctx: TickContext, entity: Entity) {
    if (entity.immortal) return

    if (conditions.find((it) => it(ctx, entity))) {
      reapEntity(ctx, entity)
    }
  },
}

const reapEntity = (ctx: TickContext, entity: Entity) => {
  console.debug(`Reaping ${entity.id}`, entity)
  ctx.api.emit({
    type: 'CullEntity',
    id: entity.id,
  })
  delete ctx.entities[entity.id]
}

const boundsCheck = (_: TickContext, entity: Entity): boolean => {
  const { position } = getComponent(entity, PositionComponent)
  // TODO: hardcoded bounds
  return position?.x >= 800 || position?.y >= 600
}

const conditions = [boundsCheck]
