import * as pixi from 'pixi.js'
import { EngineEvent } from '../api/event/EngineEventAPI'
import { EventEmitter, IEvent } from '../api/EventEmitter'

export type AppContext = {
  id: number,
  app: pixi.Application
  eventing: EventEmitter<IEvent>
  entityToObject: Record<string, pixi.DisplayObject>
}

let id = 0
export const newAppContext = (): AppContext => {
  return {
    id: id++,
    app: new pixi.Application(),
    eventing: new EventEmitter(),
    entityToObject: {},
  }
}
