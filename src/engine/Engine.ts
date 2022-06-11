import { Entity } from '../api/ecs/Entity'
import { System } from '../api/ecs/System'
import { TickContext } from '../api/ecs/Tick'
import { EngineEvent, EngineEventAPI } from '../api/event/EngineEventAPI'
import { AllSystems } from './ecs/systems'

export const startEngine = (
  initialEntities: Entity[],
  eventHandler: (event: EngineEvent) => void,
) => {
  const entities: Set<Entity> = new Set()
  const systems: System[] = [...AllSystems]
  const api = new EngineEventAPI.Default(eventHandler)

  const tick = () => {
    const ctx: TickContext = { api }

    systems.forEach((sys) =>
      entities.forEach((entity) => {
        sys.process(ctx, entity)
      }),
    )
  }

  setInterval(() => tick(), 20)
  initialEntities.forEach((it) => entities.add(it))
}
