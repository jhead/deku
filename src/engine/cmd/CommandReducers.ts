import uuid from 'short-uuid'
import {
  DiscreteMotionComponent,
  PositionComponent,
} from '../../api/builtin/Physics'
import { DraggableComponent } from '../../api/builtin/Render'
import { getComponent, withComponent } from '../../api/ecs/Entity'
import { TickContext } from '../../api/ecs/Tick'
import { EngineCommand, EntityCommand } from '../../api/event/EngineEventAPI'
import { Point } from '../../api/types/Geom'

export type CommandReducer<T extends EngineCommand> = (
  ctx: TickContext,
  cmd: T,
) => void

const handlePutEntity: CommandReducer<EntityCommand.PutEntity> = (
  ctx,
  { entity },
) => {
  const id = uuid.generate()

  ctx.entities[id] = {
    ...entity,
    id,
  }

  console.debug('put entity', entity)
}

const handleEntityInteract: CommandReducer<EntityCommand.Interact> = (
  ctx,
  event,
) => {
  const { type } = event.event
  const entity = ctx.entities[event.id]
  if (!entity) return

  const draggable = getComponent(entity, DraggableComponent)

  if (type === 'pointerdown') {
    draggable.dragState = true

    // Zero motion
    withComponent(
      entity,
      DiscreteMotionComponent,
    )((motion) => {
      motion.velocity = Point.Zero
    })
  } else if (type === 'pointerup' || type === 'pointerupoutside') {
    draggable.dragState = false
  } else if (type === 'pointermove') {
    withComponent(
      entity,
      PositionComponent,
    )((pos) => {
      pos.position = {
        x: event.event.x,
        y: event.event.y,
      }
    })
  }
}

const handleResetState: CommandReducer<EngineCommand.ResetState> = (ctx, _) => {
  ctx.engine.stop()
  ctx.engine.stateStore.clear()
}

export const CommandReducers = {
  PutEntity: handlePutEntity,
  ResetState: handleResetState,
  EntityInteract: handleEntityInteract,
}
