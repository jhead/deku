import { TickContext } from '../../api/ecs/Tick'
import { EngineCommand, EntityCommand } from '../../api/event/EngineEventAPI'

type CommandReducer<T extends EngineCommand> = (
  ctx: TickContext,
  cmd: T,
) => void

let globalEntityId = 0
const handlePutEntity: CommandReducer<EntityCommand.PutEntity> = (
  ctx,
  { entity },
) => {

  ctx.entities[`${++globalEntityId}`] = {
    ...entity,
    id: `${globalEntityId}`,
  }

  console.debug('put entity', entity)
}

export const CommandReducers = {
  PutEntity: handlePutEntity,
}
