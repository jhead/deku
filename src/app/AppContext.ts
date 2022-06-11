import * as pixi from 'pixi.js'
import { EngineEvent } from '../api/event/EngineEventAPI
import { EventEmitter } from './EventEmitter'

export type AppContext = {
  app: pixi.Application,
  eventing: EventEmitter<EngineEvent>,
  entityToObject: Record<string, pixi.DisplayObject>
}

export const createApplication = (): AppContext =>{
  return ({
    app: new pixi.Application(),
    eventing: new EventEmitter(),
    entityToObject: {},
  })
}