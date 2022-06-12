import { Engine } from '../../engine'
import { EngineEventAPI } from '../event/EngineEventAPI'
import { Entity } from './Entity'

export type TickContext = {
  engine: Engine,
  entities: Record<string, Entity>
  api: EngineEventAPI
}
