import * as pixi from 'pixi.js'
import { RenderEvent } from '../../engine/ecs/systems/Render'
import { AppContext } from '../AppContext'

export type Reducer<T extends RenderEvent> = (
  ctx: AppContext,
  view: pixi.Container,
  event: T
) => void

type HasType<T extends string> = { type: T }
type PickType<T> = T extends HasType<infer U> ? U : never
type ReducerMap = {
  [E in RenderEvent as PickType<E>]: Reducer<E>
}

export const Reducers: ReducerMap = {
  AddObject: (ctx, view, { id, objectType }) => {
    const obj = new pixi[objectType]()
    view.addChild(obj)
    ctx.entityToObject[id] = obj
  },

  Transform: (ctx, _, event) => {
    const { id, position, positionDelta } = event
    if (position) {
      ctx.entityToObject[id].x = position.x
      ctx.entityToObject[id].y = position.y
    }

    if (positionDelta) {
      ctx.entityToObject[id].x += positionDelta.x
      ctx.entityToObject[id].y += positionDelta.y
    }
  },

  RPC: (ctx, _, { id, fn, args }) => {
    if (id) {
      ctx.entityToObject[id][fn](...args)
    } else {
      ctx.app.view[fn](...args)
    }
  },
}
