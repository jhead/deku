import {
  ComponentDelta,
  EngineEvent,
  EntityCommand,
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

const interactEvents: readonly string[] = [
  'pointerdown',
  'pointerup',
  'pointerupoutside',
]

const handlePutObject: EngineEventHandler<RenderEvent.PutObject> =
  (ctx) =>
  ({ id, obj }) => {
    if (ctx.entityToObject[id]) {
      console.warn('Object already exists with ID!', id)
      return
    }

    // todo: parent
    const pixiObject = new PixiDraw(ctx, ctx.app.stage).draw(obj)
    pixiObject.interactive = true

    const onInteract = (eventType: string) => (event: any) => {
      // TODO: jank
      ctx.eventing.emit<EntityCommand.Interact>('Worker', {
        type: 'EntityInteract',
        id,
        event: {
          type: eventType,
          x: event.data.global.x,
          y: event.data.global.y,
        },
      })
    }

    interactEvents.forEach((eventType) => {
      pixiObject.on(eventType, onInteract(eventType))
    })

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

const handleCullEntity: EngineEventHandler<EntityEvent.CullEntity> =
  (ctx) =>
  ({ id }) => {
    const obj = ctx.entityToObject[id]
    delete ctx.entityToObject[id]
    obj?.parent?.removeChild(obj)
    obj?.destroy()
  }

export namespace RenderAdapter {
  export const registerEventHandlers = (ctx: AppContext) => {
    ctx.eventing.addEventListener('PutObject', handlePutObject(ctx))
    ctx.eventing.addEventListener('EntityUpdate', handleEntityUpdate(ctx))
    ctx.eventing.addEventListener('CullEntity', handleCullEntity(ctx))

    // TODO: move this
    ctx.app.stage.interactive = true
    ctx.app.stage.on('pointermove', ({ data }) => {
      ctx.eventing.emit<EntityCommand.Interact>('Worker', {
        id: 'Pointer',
        type: 'EntityInteract',
        event: {
          type: 'pointermove',
          x: data.global.x,
          y: data.global.y,
        },
      })
    })
  }
}
