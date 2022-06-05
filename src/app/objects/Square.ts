import { Entity, Point } from '../../engine'
import { RenderComponent } from '../../engine/ecs/systems'

type SquareProps = { 
  position?: Point
  velocity?: Point
}

export class Square extends Entity.Rigid {
  constructor({ position = Point.Zero, velocity = Point.Zero }: SquareProps) {
    super({
      obj: Square.createObject(),
      pos: {
        type: 'Component',
        componentName: 'Position',
        position,
      },
      motion: {
        type: 'Component',
        componentName: 'DiscreteMotion',
        velocity,
      },
    })
  }

  static createObject(): RenderComponent {
    return {
      type: 'Component',
      componentName: 'Render',
    }
  }
}
