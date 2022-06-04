import * as pixi from 'pixi.js'
import { Application } from 'pixi.js'

export type AppContext = {
  app: Application,
  entityToObject: Record<string, pixi.DisplayObject>
}
