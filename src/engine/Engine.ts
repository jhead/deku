import { Entity } from '../api/ecs/Entity'
import { System } from '../api/ecs/System'
import { TickContext } from '../api/ecs/Tick'
import {
  EngineCommand,
  EngineEvent,
  EngineEventAPI,
} from '../api/event/EngineEventAPI'
import { EventEmitter } from '../api/EventEmitter'
import { CommandReducers } from './cmd/CommandRedcuers'
import { AllSystems } from './ecs/systems'

export class Engine {
  private readonly entities: Record<string, Entity> = {}
  private readonly systems: System[] = [...AllSystems]
  private readonly internalApi: EngineEventAPI
  private readonly emitter: EventEmitter<EngineEvent> = new EventEmitter()
  private readonly commandQueue: EngineCommand[] = []

  private running: boolean = false
  private tickIntervalRef: number

  constructor() {
    this.internalApi = new EngineEventAPI.Default((event) =>
      this.emitter.emit('Outbound', event),
    )
  }

  start() {
    if (this.running) {
      console.warn('Engine already running, cannot start again!')
      return
    }

    this.tickIntervalRef = setInterval(() => this.tick(), 20)
    this.running = true
  }

  stop() {
    if (!this.running) {
      console.warn('Engine not running, cannot stop!')
      return
    }

    clearInterval(this.tickIntervalRef)
    this.emitter.clear()
    this.running = false
  }

  onEngineEvent(handler: (event: EngineEvent) => void) {
    this.emitter.addEventListener('Outbound', handler)
  }

  sendCommand(cmd: EngineCommand) {
    this.commandQueue.push(cmd)
  }

  private tick() {
    const { systems, entities, commandQueue } = this
    const ctx: TickContext = {
      api: this.internalApi,
      entities,
    }

    while (commandQueue.length > 0) {
      const cmd = commandQueue.shift()
      const reducer = CommandReducers[cmd.type]

      if (reducer) {
        reducer(ctx, cmd)
      } else {
        console.warn('Unknown engine command', cmd)
      }
    }

    systems.forEach((sys) =>
      Object.values(entities).forEach((entity) => {
        sys.process(ctx, entity)
      }),
    )
  }
}
