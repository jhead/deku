import { PositionComponent } from '../builtin/Physics'
import { Entity } from '../ecs/Entity'
import { Point } from '../types/Geom'

export const Pointer: Entity = {
  id: 'Pointer',
  type: 'Entity',
  components: [
    <PositionComponent>{
      type: 'Component',
      componentName: 'Position',
      position: Point.Zero,
    },
  ],
  immortal: true,
}
