import { Entity } from './Entity'
import { TickContext } from './Tick'

export type System = {
  name: string
  process(ctx: TickContext, entity: Entity): void
}
