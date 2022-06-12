import { PositionComponent } from '../../../api/builtin/Physics'
import {
  DraggableComponent,
  RenderComponent,
} from '../../../api/builtin/Render'
import { Entity, getComponent, withComponent } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'

const entitySet: WeakSet<Entity> = new WeakSet()

export const RenderSystem: System = {
  name: 'Render',

  process(ctx: TickContext, entity: Entity) {
    processRenderComponent(ctx, entity)
    processDraggableComponent(ctx, entity)
  },
}

const processRenderComponent = (ctx: TickContext, entity: Entity) => {
  if (entitySet.has(entity)) return

  withComponent(
    entity,
    RenderComponent,
  )((render) => {
    console.debug('adding obj', entity.id)
    entitySet.add(entity)
    ctx.api.emit({
      type: 'PutObject',
      id: entity.id,
      obj: render.obj,
    })
  })
}

const processDraggableComponent = (ctx: TickContext, entity: Entity) => {
  const pos = getComponent(entity, PositionComponent)

  const pointer = ctx.entities['Pointer']
  if (!pointer) return

  withComponent(
    entity,
    DraggableComponent,
  )((draggable) => {
    if (draggable.dragState) {
      const pointerPos = getComponent(pointer, PositionComponent)?.position
      const size = getComponent(entity, RenderComponent)?.obj?.visual?.size

      pos.position = {
        x: Math.round(pointerPos.x - size.width.value / 2),
        y: Math.round(pointerPos.y - size.height.value / 2),
      }
    }
  })
}
