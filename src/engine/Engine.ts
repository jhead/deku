import { PositionComponent } from '../api/builtin/Physics'
import { Entity } from '../api/ecs/Entity'
import { System } from '../api/ecs/System'
import { TickContext } from '../api/ecs/Tick'
import {
  EngineCommand,
  EngineEvent,
  EngineEventAPI,
} from '../api/event/EngineEventAPI'
import { EventEmitter } from '../api/EventEmitter'
import { Point } from '../api/types/Geom'
import { CommandReducer, CommandReducers } from './cmd/CommandReducers'
import { AllSystems } from './ecs/systems'
import { NoOpStateStore, StateStore } from './state/StateStore'
import { Ticker, TickStats } from './Ticker'

type EntityMap = Record<string, Entity>

export type EngineState = {
  readonly entities: EntityMap
}

const internalEntities: EntityMap = {
  Pointer: {
    id: 'Pointer',
    type: 'Entity',
    components: [
      <PositionComponent>{
        type: 'Component',
        componentName: 'Position',
        position: Point.Zero,
      },
    ],
  },
}

export const emptyState = (): EngineState => ({
  entities: { ...internalEntities },
})

export class Engine {
  private readonly systems: System[] = [...AllSystems]
  private readonly internalApi: EngineEventAPI
  private readonly emitter: EventEmitter<EngineEvent> = new EventEmitter()
  private readonly commandQueue: EngineCommand[] = []
  private readonly ticker: Ticker

  private state: EngineState
  private running: boolean = false
  private stateIntervalRef: number

  constructor(public stateStore: StateStore = NoOpStateStore) {
    this.internalApi = new EngineEventAPI.Default((event) =>
      this.emitter.emit('Outbound', event),
    )

    this.ticker = new Ticker(50, () => this.tick())
    this.ticker.onTickStats(this.logTickStats)
  }

  async start() {
    if (this.running) {
      console.warn('Engine already running, cannot start again!')
      return
    }

    const initialState = await this.stateStore.load()
    this.state = initialState
    this.ticker.start()

    this.stateIntervalRef = setInterval(
      () => this.stateStore.store(this.state),
      1000,
    )
    this.running = true
  }

  stop() {
    if (!this.running) {
      console.warn('Engine not running, cannot stop!')
      return
    }

    this.ticker.stop()
    clearInterval(this.stateIntervalRef)
    this.running = false
  }

  onEngineEvent(handler: (event: EngineEvent) => void) {
    this.emitter.addEventListener('Outbound', handler)
  }

  sendCommand(cmd: EngineCommand) {
    this.commandQueue.push(cmd)
  }

  public get currentState(): EngineState {
    return { ...this.state }
  }

  private tick() {
    if (!this.running) return
    const { entities } = this.state

    const ctx: TickContext = {
      engine: this,
      api: this.internalApi,
      entities,
    }

    this.tickCommands(ctx)
    this.tickEntities(ctx)
  }

  private tickCommands(ctx: TickContext) {
    const { commandQueue } = this

    while (commandQueue.length > 0) {
      const cmd = commandQueue.shift()
      const reducer = CommandReducers[cmd.type] as CommandReducer<typeof cmd>

      if (reducer) {
        reducer(ctx, cmd)
      } else {
        console.warn('Unknown engine command', cmd)
      }
    }
  }

  private tickEntities(ctx: TickContext) {
    const { systems } = this
    const { entities } = ctx

    const entitySet = Object.values(entities)
    systems.forEach((sys) =>
      entitySet.forEach((entity) => {
        sys.process(ctx, entity)
      }),
    )
  }

  private logTickStats = (stats: TickStats) => {
    console.debug('Tick Stats', stats, {
      entityCount: Object.values(this.state.entities).length,
      state: this.state,
    })
  }
}
