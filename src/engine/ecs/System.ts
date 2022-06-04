import { TickContext, Entity } from '.'

export type System = {
  process(ctx: TickContext, entity: Entity): void
}
