import { Component, Entity, System, TickContext } from '../..'
import { RenderObject } from './types'

export const RenderComponentName = 'Render'

export type RenderComponent = Component & {
  componentName: typeof RenderComponentName
  obj: RenderObject
}

const entitySet: Set<string> = new Set()

export const RenderSystem: System = {
  name: RenderComponentName,

  process(ctx: TickContext, entity: Entity) {
    if (entitySet.has(entity.id)) return

    const [comp] = Entity.getComponent<RenderComponent>(entity, RenderComponentName)
    if (!comp) return // TODO

    console.log('adding obj', entity.id)
    entitySet.add(entity.id)
    ctx.api.emit({
      type: 'PutObject',
      id: entity.id,
      obj: comp.obj,
    })
  },
}
