import { Component } from '../ecs/Component'
import { Point } from '../types/Geom'

export const PositionComponentName = 'Position'
export type PositionComponent = Component & {
  componentName: typeof PositionComponentName
  position: Point
}

export const DiscreteMotionComponentName = 'DiscreteMotion'
export type DiscreteMotionComponent = Component & {
  componentName: typeof DiscreteMotionComponentName
  velocity: Point
}
