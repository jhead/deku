import { TickContext, Entity } from '.'

export type System = {
  name: string
  process(ctx: TickContext, entity: Entity): void
}
