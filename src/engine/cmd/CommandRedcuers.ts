import { TickContext } from '../../api/ecs/Tick'
import { EngineCommand, EntityCommand } from '../../api/event/EngineEventAPI'
import uuid from 'short-uuid'

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

const handleResetState: CommandReducer<EngineCommand.ResetState> = (
  ctx,
  _,
) => {
  ctx.engine.stop()
  ctx.engine.stateStore.clear()
}

export const CommandReducers = {
  PutEntity: handlePutEntity,
  ResetState: handleResetState,
}
