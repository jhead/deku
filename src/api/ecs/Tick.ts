import { EngineEventAPI } from '../event/EngineEventAPI'
import { Entity } from './Entity'

export type TickContext = {
  entities: Record<string, Entity>
  api: EngineEventAPI
}
