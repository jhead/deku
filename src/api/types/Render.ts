import { Bounds, Point, Scale, Size } from './Geom'

/** A thing that can be rendered */
export type RenderObject = {
  type: 'RenderObject'
  pos: Point
  visual: Visual
}

export type Visual = Shape

export type Shape = Rectangle

export type Rectangle = {
  type: 'Rectangle'
  size: Size<Scale.Static>
  fillColor: Color
}

export type Color = number
