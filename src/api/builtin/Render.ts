import { Component } from "../ecs/Component"
import { RenderObject } from "../types/Render"

export const RenderComponentName = 'Render'

export type RenderComponent = Component & {
  componentName: typeof RenderComponentName
  obj: RenderObject
}
