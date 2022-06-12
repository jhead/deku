import * as pixi from 'pixi.js'
import { EventEmitter, EventQueue, IEvent } from '../api/EventEmitter'

export type AppContext = {
  id: number,
  app: pixi.Application
  eventing: EventQueue<IEvent>
  entityToObject: Record<string, pixi.DisplayObject>
}

let id = 0
export const newAppContext = (): AppContext => {
  return {
    id: id++,
    app: new pixi.Application(),
    eventing: new EventQueue(),
    entityToObject: {},
  }
}
