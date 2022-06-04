import { Component, Entity, System, TickContext } from '../..'

export const RenderComponentName = 'Render'

export type RenderComponent = Component & {
  componentName: typeof RenderComponentName
}

const entitySet: Set<string> = new Set()

export const RenderSystem: System = {
  name: RenderComponentName,

  process(ctx: TickContext, entity: Entity) {
    if (entitySet.has(entity.id)) return

    Entity.getComponent<RenderComponent>(entity, RenderComponentName).forEach(
      (comp) => {
        ctx.api.addObject({
          id: entity.id,
          objectType: 'Graphics',
        })

        ctx.api.rpc({
          id: entity.id,
          fn: 'beginFill',
          args: [0xff0000],
        })

        ctx.api.rpc({
          id: entity.id,
          fn: 'drawRect',
          args: [0, 0, 200, 100],
        })

        entitySet.add(entity.id)
      }
    )
  },
}
