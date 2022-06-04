import { Point } from '../../../types/Geom'

export type ObjectEvent =
  | ObjectEvent.AddObject
  | ObjectEvent.Transform
  | ObjectEvent.RPC

export namespace ObjectEvent {
  type BaseEvent<T extends string> = {
    type: T
  }

  export type AddObject = BaseEvent<'AddObject'> & ObjectAPI.AddObjectProps
  export type Transform = BaseEvent<'Transform'> & ObjectAPI.TransformProps
  export type RPC = BaseEvent<'RPC'> & ObjectAPI.RPCProps
}

export namespace ObjectAPI {
  type BaseProps = {
    id: string
  }

  export type AddObjectProps = BaseProps & {
    objectType: string
    parent?: string
  }

  export type TransformProps = BaseProps & {
    position?: Point
    positionDelta?: Point
  }

  export type RPCProps = {
    id?: string
    fn: string
    args: any[]
  }
}

export interface ObjectAPI {
  addObject(options: ObjectAPI.AddObjectProps)
  transform(options: ObjectAPI.TransformProps)
  rpc(options: ObjectAPI.RPCProps)
}

export class ObjectEventAPI implements ObjectAPI {
  constructor(private readonly emitter: (event: ObjectEvent) => void) {}

  addObject(options: ObjectAPI.AddObjectProps) {
    this.emit({ ...options, type: 'AddObject' })
  }

  transform(options: ObjectAPI.TransformProps) {
    this.emit({ ...options, type: 'Transform' })
  }

  rpc(options: ObjectAPI.RPCProps) {
    this.emit({ ...options, type: 'RPC' })
  }

  private emit(event: ObjectEvent) {
    this.emitter(event)
  }
}
