import {
  ComponentDelta,
  EngineEvent,
  EntityEvent,
  RenderEvent,
} from '../../api/event/EngineEventAPI'
import { AppContext } from '../../app/AppContext'
import { EventHandler } from '../../api/EventEmitter'
import { PixiDraw } from './Draw'
import { RenderReducers } from './RenderReducers'

type EngineEventHandler<E extends EngineEvent> = (
  ctx: AppContext,
) => EventHandler<E>

const handlePutObject: EngineEventHandler<RenderEvent.PutObject> =
  (ctx) =>
  ({ id, obj }) => {
    // todo: parent
    const pixiObject = new PixiDraw(ctx, ctx.app.stage).draw(obj)
    ctx.entityToObject[id] = pixiObject
  }

const handleEntityUpdate: EngineEventHandler<EntityEvent.EntityUpdate> =
  (ctx) => (event) => {
    const { delta } = event

    const getReducer = (it: ComponentDelta) => {
      const reducer = RenderReducers[it.componentName]
      return () => reducer(ctx, event, it)
    }

    delta.map(getReducer).forEach((it) => it())
  }

export namespace RenderAdapter {
  export const registerEventHandlers = (ctx: AppContext) => {
    ctx.eventing.addEventListener('PutObject', handlePutObject(ctx))
    ctx.eventing.addEventListener('EntityUpdate', handleEntityUpdate(ctx))
  }
}
