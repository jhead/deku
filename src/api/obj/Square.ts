import { Point, Scale } from '../types/Geom'
import { Entity } from '../ecs/Entity'
import { RenderComponent } from '../builtin/Render'

type SquareProps = {
  position?: Point
  velocity?: Point
  color?: number
}

export class Square extends Entity.Rigid {
  constructor({
    position = Point.Zero,
    velocity = Point.Zero,
    color = Square.randomColor(),
  }: SquareProps) {
    super({
      obj: Square.createObject(color),
      pos: {
        type: 'Component',
        componentName: 'Position',
        position,
      },
      motion: {
        type: 'Component',
        componentName: 'DiscreteMotion',
        velocity,
      }
    })
  }

  static createObject(color: number): RenderComponent {
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
          fillColor: color,
        },
      },
    }
  }

  static randomColor(): number {
    const rand = () => Math.round(Math.random() * 255)
    return (
      (rand() << 16) +
      (rand() << 8) +
      (rand())
    )
  }
}
