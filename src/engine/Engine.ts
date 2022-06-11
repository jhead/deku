import { Entity } from '../api/ecs/Entity'
import { System } from '../api/ecs/System'
import { TickContext } from '../api/ecs/Tick'
import { EngineEvent, EngineEventAPI } from '../api/event/EngineEventAPI'
import { EventEmitter } from '../api/EventEmitter'
import { AllSystems } from './ecs/systems'

export class Engine {
  private readonly internalApi: EngineEventAPI
  private readonly emitter: EventEmitter<EngineEvent> = new EventEmitter()

  private running: boolean = false
  private tickIntervalRef: number

  constructor(
    private readonly entities: Set<Entity> = new Set(),
    private readonly systems: System[] = [...AllSystems],
  ) {
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

  private tick() {
    const { systems, entities } = this
    const ctx: TickContext = { api: this.internalApi }

    systems.forEach((sys) =>
      entities.forEach((entity) => {
        sys.process(ctx, entity)
      }),
    )
  }
}
