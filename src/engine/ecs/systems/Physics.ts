import {
  DiscreteMotionComponent,
  PositionComponent,
} from '../../../api/builtin/Physics'
import { Entity } from '../../../api/ecs/Entity'
import { System } from '../../../api/ecs/System'
import { TickContext } from '../../../api/ecs/Tick'

export const PhysicsSystem: System = {
  name: 'Physics',

  process(ctx: TickContext, entity: Entity) {
    const pos = Entity.getComponent(entity, PositionComponent)
    if (!pos) return

    const motion = Entity.getComponent(entity, DiscreteMotionComponent)

    if (motion) {
      pos.position = {
        x: pos.position.x + motion.velocity.x,
        y: pos.position.y + motion.velocity.y,
      }
    }
  },
}
