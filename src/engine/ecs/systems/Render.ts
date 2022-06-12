import {
  RenderComponent,
  RenderComponentName,
} from '../../../api/builtin/Render'
import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'

const entitySet: WeakSet<Entity> = new WeakSet()

export const RenderSystem: System = {
  name: RenderComponentName,

  process(ctx: TickContext, entity: Entity) {
    if (entitySet.has(entity)) return

    const [comp] = Entity.getComponent<RenderComponent>(
      entity,
      RenderComponentName,
    )
    if (!comp) return // TODO

    console.debug('adding obj', entity.id)
    entitySet.add(entity)
    ctx.api.emit({
      type: 'PutObject',
      id: entity.id,
      obj: comp.obj,
    })
  },
}
