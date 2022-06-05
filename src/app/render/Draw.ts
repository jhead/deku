import * as pixi from 'pixi.js'
import { Rectangle, RenderObject } from '../../engine/ecs/systems/Render/types'
import { AppContext } from '../AppContext'

export interface Draw<T = any> {
  draw(obj: RenderObject): T
}

export class PixiDraw implements Draw<pixi.DisplayObject> {
  constructor(
    private readonly ctx: AppContext,
    private readonly view: pixi.Container,
  ) {}

  draw(obj: RenderObject): pixi.DisplayObject {
    if (obj.visual.type === 'Rectangle') {
      return this.drawRectangle(obj, obj.visual)
    }

    throw new Error(`Unsupported visual: ${obj}`)
  }

  drawRectangle(obj: RenderObject, rect: Rectangle): pixi.DisplayObject {
    const { view } = this

    const display = new pixi.Graphics()
    display.beginFill(rect.fillColor)
    display.drawRect(
      obj.pos.x,
      obj.pos.y,
      rect.size.width.value,
      rect.size.height.value
    )
    view.addChild(display)

    return display
  }
}
