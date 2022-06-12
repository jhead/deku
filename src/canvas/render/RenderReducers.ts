import { PositionComponent } from '../../api/builtin/Physics'
import { Component } from '../../api/ecs/Component'
import { ComponentDelta, EntityEvent } from '../../api/event/EngineEventAPI'
import { AppContext } from '../../app/AppContext'

type ComponentReducer<T extends Component> = (
  ctx: AppContext,
  event: EntityEvent,
  delta: ComponentDelta<T>,
) => void

const updatePositionReducer: ComponentReducer<PositionComponent> = (
  ctx: AppContext,
  event: EntityEvent,
  delta: ComponentDelta<PositionComponent>,
) => {
  const { position } = delta

  const obj = ctx.entityToObject[event.id]
  if (!obj) return

  if (position) {
    obj.x = position.x
    obj.y = position.y
  }
}


export const RenderReducers = {
  Position: updatePositionReducer,
}
