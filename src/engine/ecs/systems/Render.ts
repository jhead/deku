import { Component } from '../../../api/ecs/Component'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'
import { RenderObject } from '../../../api/types/Render'
import { Entity } from '../Entity'

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

    const [comp] = Entity.getComponent<RenderComponent>(
      entity,
      RenderComponentName,
    )
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
