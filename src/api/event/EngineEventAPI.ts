import { Component } from '../ecs/Component'
import { Entity } from '../../api/ecs/Entity'
import { RenderObject } from '../types/Render'

export type EngineEvent = EntityEvent | RenderEvent

type BaseEvent<T extends string> = {
  type: T
}

export type EntityEvent = EntityEvent.EntityUpdate
export namespace EntityEvent {
  export type EntityUpdate = BaseEvent<'EntityUpdate'> & {
    id: string
    delta: ComponentDelta[]
  }
}

export type ComponentDelta<T extends Component = Component> = Partial<T> &
  Pick<T, 'componentName'>

export type RenderEvent = RenderEvent.PutObject

export namespace RenderEvent {
  export type PutObject = BaseEvent<'PutObject'> & {
    id: string
    obj: RenderObject
    parent?: string
  }
}

export type EngineEventAPI = {
  emit(event: EngineEvent)
}

export namespace EngineEventAPI {
  export class Default implements EngineEventAPI {
    constructor(readonly emit: (event: EngineEvent) => void) {}
  }
}

export type EngineCommand = EngineCommand.ResetState | EntityCommand.PutEntity

export namespace EngineCommand {
  export type ResetState = BaseEvent<'ResetState'>
}

export namespace EntityCommand {
  export type PutEntity = BaseEvent<'PutEntity'> & {
    entity: Omit<Entity, 'id'>
  }
}
