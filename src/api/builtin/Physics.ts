import { Component, componentRef } from '../ecs/Component'
import { Point } from '../types/Geom'

export type PositionComponent = Component & {
  componentName: 'Position'
  position: Point
}

export const PositionComponent = componentRef<PositionComponent>('Position')

export type DiscreteMotionComponent = Component & {
  componentName: 'DiscreteMotion'
  velocity: Point
}

export const DiscreteMotionComponent =
  componentRef<DiscreteMotionComponent>('DiscreteMotion')
