import { Point } from '../../..'
import { RenderObject } from './types'

export type EntityEvent =
  | EntityEvent.AddObject
  | EntityEvent.Transform

export namespace EntityEvent {
  type BaseEvent<T extends string> = {
    type: T
  }

  export type AddObject = BaseEvent<'AddObject'> & EntityAPI.AddObjectProps
  export type Transform = BaseEvent<'Transform'> & EntityAPI.TransformProps
}

export namespace EntityAPI {
  type BaseProps = {
    id: string
  }

  export type AddObjectProps = BaseProps & {
    obj: RenderObject
    parent?: string
  }

  export type TransformProps = BaseProps & {
    position?: Point
    positionDelta?: Point
  }
}

export interface EntityAPI {
  addObject(options: EntityAPI.AddObjectProps)
  transform(options: EntityAPI.TransformProps)
}

export class EntityEventAPI implements EntityAPI {
  constructor(private readonly emitter: (event: EntityEvent) => void) {}

  addObject(options: EntityAPI.AddObjectProps) {
    this.emit({ ...options, type: 'AddObject' })
  }

  transform(options: EntityAPI.TransformProps) {
    this.emit({ ...options, type: 'Transform' })
  }

  private emit(event: EntityEvent) {
    this.emitter(event)
  }
}
