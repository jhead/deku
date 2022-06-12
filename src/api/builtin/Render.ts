import { Component, componentRef } from '../ecs/Component'
import { RenderObject } from '../types/Render'

export type RenderComponent = Component & {
  componentName: 'Render'
  obj: RenderObject
}

export const RenderComponent = componentRef<RenderComponent>('Render')

export type DraggableComponent = Component & {
  componentName: 'Draggable'
  dragState?: boolean
}

export const DraggableComponent = componentRef<DraggableComponent>('Draggable')
