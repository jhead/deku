import * as pixi from 'pixi.js'
import { EntityEvent } from '../../engine/ecs/systems/Render'
import { AppContext } from '../AppContext'
import { PixiDraw } from './Draw'

export type Reducer<T extends EntityEvent> = (
  ctx: AppContext,
  view: pixi.Container,
  event: T
) => void

type HasType<T extends string> = { type: T }
type PickType<T> = T extends HasType<infer U> ? U : never
type ReducerMap = {
  [E in EntityEvent as PickType<E>]: Reducer<E>
}

export const Reducers: ReducerMap = {
  AddObject: (ctx, view, { id, obj }) => {
    const pixiObject = new PixiDraw(ctx, view).draw(obj)
    ctx.entityToObject[id] = pixiObject
  },

  Transform: (ctx, _, event) => {
    const { id, position, positionDelta } = event
    const obj = ctx.entityToObject[id]
    if (!obj) return

    if (position) {
      obj.x = position.x
      obj.y = position.y
    }

    if (positionDelta) {
      obj.x += positionDelta.x
      obj.y += positionDelta.y
    }
  }, 
}
