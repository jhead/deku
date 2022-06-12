import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'

const ORIGINAL_KEY = '_proxy_original_target'
const entityDeltas: WeakMap<Entity, any[]> = new WeakMap()

const proxy = <T extends object>(
  root: any,
  it: T,
  visitor: ((value: any) => void) | null = null,
): T =>
  new Proxy(it, {
    get(target, prop, receiver) {
      if (prop === ORIGINAL_KEY) return root
      return target[prop]
    },
    set(target, prop, value): boolean {
      target[prop] = value
      if (visitor) visitor([prop, value])
      return true
    },
  })

const proxyEntity = (ctx: TickContext, entity: Entity) => {
  entityDeltas.set(entity, [])

  const proxiedComponents = entity.components.map((it) =>
    proxy(entity, it, ([prop, value]) => {
      entityDeltas.get(entity).push({
        componentName: it.componentName,
        [prop]: value,
      })
    }),
  )

  // TODO: proxy the entity itself
  ctx.entities[entity.id] = proxy(entity, {
    ...entity,
    components: proxiedComponents,
  })
}

export const ChangeObserver: System = {
  name: 'ChangeObserver',
  process: function (ctx: TickContext, entity: Entity) {
    const originalEntity = entity[ORIGINAL_KEY]

    if (!originalEntity) {
      proxyEntity(ctx, entity)
      return
    }

    const delta = entityDeltas.get(originalEntity) || []
    if (delta.length > 0) {
      ctx.api.emit({
        type: 'EntityUpdate',
        id: originalEntity.id,
        delta,
      })
      entityDeltas.set(originalEntity, [])
    }
  },
}
