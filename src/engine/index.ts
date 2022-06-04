import { ObjectEvent, ObjectEventAPI } from './ecs/object/api'
import { Entity, System, Systems, TickContext } from './ecs'

export * from './ecs'

export const startEngine = (
  initialEntities: Entity[],
  eventHandler: (event: ObjectEvent) => void,
) => {
  const entities: Set<Entity> = new Set()
  const systems: System[] = [...Systems.All]
  const api = new ObjectEventAPI(eventHandler)

  const tick = () => {
    const ctx: TickContext = { api }

    systems.forEach((sys) =>
      entities.forEach((entity) => {
        sys.process(ctx, entity)
      })
    )
  }

  setInterval(() => tick(), 20)
  initialEntities.forEach(it => entities.add(it))
}
