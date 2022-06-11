import { Component, ComponentName } from './Component'

export type Entity = {
  readonly type: 'Entity'
  readonly id: string
  readonly components: Component[]
}

export declare namespace Entity {
  function getComponent<T extends Component>(
    entity: Entity,
    componentName: ComponentName<T>,
  ): T[]
}
