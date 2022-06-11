import { Point, Scale } from '../../api/types/Geom'
import { Entity } from '../../engine/ecs/Entity'
import { RenderComponent } from '../../engine/ecs/systems/Render'

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
      obj: {
        type: 'RenderObject',
        pos: Point.Zero,
        visual: {
          type: 'Rectangle',
          size: {
            width: Scale.Static(100),
            height: Scale.Static(100),
          },
          fillColor: 0xff0000,
        },
      },
    }
  }
}
