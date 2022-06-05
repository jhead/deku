import { Entity, System, Systems, TickContext } from './ecs'
import { RenderEvent, RenderEventAPI } from './ecs/systems/Render'

export const startEngine = (
  initialEntities: Entity[],
  eventHandler: (event: RenderEvent) => void
) => {
  const entities: Set<Entity> = new Set()
  const systems: System[] = [...Systems.All]
  const api = new RenderEventAPI(eventHandler)

  const tick = () => {
    const ctx: TickContext = { api }

    systems.forEach((sys) =>
      entities.forEach((entity) => {
        sys.process(ctx, entity)
      })
    )
  }

  setInterval(() => tick(), 20)
  initialEntities.forEach((it) => entities.add(it))
}
