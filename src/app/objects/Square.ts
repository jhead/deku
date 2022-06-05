import { Entity, Point, Scale } from '../../engine'
import { RenderComponent } from '../../engine/ecs/systems'

type SquareProps = { 
  position?: Point
  velocity?: Point
}

export class Square extends Entity.Rigid {
  constructor({ position = Point.Zero, velocity = Point.Zero }: SquareProps) {
    super({
      obj: Square.createObject(position),
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

  static createObject(pos: Point): RenderComponent {
    return {
      type: 'Component',
      componentName: 'Render',
      obj: {
        type: 'RenderObject',
        pos,
        visual: {
          type: 'Rectangle',
          size: {
            width: Scale.Static(100),
            height: Scale.Static(100),
          },
          fillColor: 0xff0000,
        }
      }
    }
  }
}
