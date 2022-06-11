import * as pixi from 'pixi.js'
import { EngineEvent } from '../engine/ecs/systems'
import { EventEmitter } from './EventEmitter'

export type AppContext = {
  app: pixi.Application,
  eventing: EventEmitter<EngineEvent>,
  entityToObject: Record<string, pixi.DisplayObject>
}
