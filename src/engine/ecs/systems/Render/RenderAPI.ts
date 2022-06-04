import { Point } from '../../../../types/Geom'

export type RenderEvent =
  | RenderEvent.AddObject
  | RenderEvent.Transform
  | RenderEvent.RPC

export namespace RenderEvent {
  type BaseEvent<T extends string> = {
    type: T
  }

  export type AddObject = BaseEvent<'AddObject'> & RenderAPI.AddObjectProps
  export type Transform = BaseEvent<'Transform'> & RenderAPI.TransformProps
  export type RPC = BaseEvent<'RPC'> & RenderAPI.RPCProps
}

export namespace RenderAPI {
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

export interface RenderAPI {
  addObject(options: RenderAPI.AddObjectProps)
  transform(options: RenderAPI.TransformProps)
  rpc(options: RenderAPI.RPCProps)
}

export class RenderEventAPI implements RenderAPI {
  constructor(private readonly emitter: (event: RenderEvent) => void) {}

  addObject(options: RenderAPI.AddObjectProps) {
    this.emit({ ...options, type: 'AddObject' })
  }

  transform(options: RenderAPI.TransformProps) {
    this.emit({ ...options, type: 'Transform' })
  }

  rpc(options: RenderAPI.RPCProps) {
    this.emit({ ...options, type: 'RPC' })
  }

  private emit(event: RenderEvent) {
    this.emitter(event)
  }
}
