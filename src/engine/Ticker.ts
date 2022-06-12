import { EventEmitter } from '../api/EventEmitter'
import { measure } from '../ext/Measured'

export type TickStats = {
  now: number,
  sinceLastTick: number
  untilNextTick: number
  targetTickTime: number
  tickDuration: number
  avgTickDuration: number
  scheduleLag: number
  avgLag: number
}

export class Ticker {
  // Internal
  private readonly memory: number = this.tickRate
  private readonly targetTickTime = 1000 / this.tickRate
  private readonly statsEvery = this.tickRate * this.targetTickTime
  private readonly emitter: EventEmitter<TickStats> = new EventEmitter()

  // Mutable state
  private readonly lastTicks: number[] = new Array(this.memory).fill(0)
  private readonly lags: number[] = new Array(this.memory).fill(0)
  private lastTickDuration: number = 0
  private lastTick: number = Date.now()
  private running: boolean = false

  constructor(
    public readonly tickRate: number = 50,
    private readonly doTick: () => any,
  ) {}

  start() {
    this.running = true
    setTimeout(this.tick, 0)
  }

  stop() {
    this.running = false
  }

  onTickStats(handler: (stats: TickStats) => void) {
    this.emitter.addEventListener('stats', handler)
  }

  onSlowTick(handler: (stats: TickStats) => void) {
    this.emitter.addEventListener('slow', handler)
  }

  private lastStatsEmit = 0
  private tryEmitStats(stats: TickStats) {
    if (stats.now - this.lastStatsEmit >= this.statsEvery) {
      this.emitter.emit('stats', stats)
      this.lastStatsEmit = Date.now()
    }
  }

  private tick = () => {
    const { targetTickTime, lags, lastTicks, running } = this
    if (!running) return

    const now = Date.now()
    const sinceLastTick = now - this.lastTick
    this.lastTick = now

    const scheduleLag = sinceLastTick - this.lastTickDuration
    if (lags.length >= 50) lags.shift()
    lags.push(scheduleLag)

    const avgLag = Math.ceil(lags.reduce((a, b) => a + b) / lags.length)

    const [_, tickDuration] = measure(this.doTick)

    if (lastTicks.length >= 50) lastTicks.shift()
    lastTicks.push(tickDuration)

    const avgTickDuration = lastTicks.reduce((a, b) => a + b) / lastTicks.length
    const untilNextTick = Math.max(
      0,
      Math.floor(targetTickTime - avgTickDuration - avgLag),
    )

    this.lastTickDuration = untilNextTick

    const stats = {
      now,
      sinceLastTick,
      untilNextTick,
      targetTickTime,
      tickDuration,
      avgTickDuration,
      scheduleLag,
      avgLag,
    }

    this.tryEmitStats(stats)
    if (sinceLastTick > targetTickTime) {
      this.emitter.emit('slow', stats)
    }

    setTimeout(this.tick, untilNextTick)
  }
}
