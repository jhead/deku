import { Point, Scale, Size } from '../types/Geom'
import { Entity } from '../ecs/Entity'
import { RenderComponent } from '../builtin/Render'

type SquareProps = {
  size?: Size<Scale.Static>
  position?: Point
  velocity?: Point
  color?: number
}

export class Square extends Entity.Rigid {
  constructor({
    size = {
      width: Scale.Static(100),
      height: Scale.Static(100),
    },
    position = Point.Zero,
    velocity = Point.Zero,
    color = Square.randomColor(),
  }: SquareProps) {
    super({
      obj: Square.createObject(size, color),
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

  static createObject(
    size: Size<Scale.Static>,
    color: number,
  ): RenderComponent {
    return {
      type: 'Component',
      componentName: 'Render',
      obj: {
        type: 'RenderObject',
        pos: Point.Zero,
        visual: {
          type: 'Rectangle',
          size,
          fillColor: color,
        },
      },
    }
  }

  static randomColor(): number {
    const rand = () => Math.round(Math.random() * 255)
    return (rand() << 16) + (rand() << 8) + rand()
  }
}
