import { Component, Entity, System, TickContext } from '..'

export type ObjectComponent = Component & {
  componentName: 'Object'
}

const entitySet: Set<string> = new Set()

export const ObjectSystem: System = {
  process(ctx: TickContext, entity: Entity) {
    if (entitySet.has(entity.id)) return

    Entity.getComponent<ObjectComponent>(entity, 'Object').forEach((comp) => {
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
    })
  },
}
