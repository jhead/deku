import { EventEmitter } from '../api/EventEmitter'
import { measure } from '../ext/Measured'

export type TickStats = {
  now: number
  sinceLastTick: number
  untilNextTick: number
  targetTickTime: number
  avgTickDuration: number
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
  private lastTick: number = performance.now()
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
      this.lastStatsEmit = performance.now()
    }
  }

  private tick = () => {
    const { lastTicks, running } = this
    if (!running) return

    const now = performance.now()
    const sinceLastTick = now - this.lastTick
    const numTicks = Math.round(sinceLastTick / this.targetTickTime)

    let ticksLeft = numTicks
    let tickDuration: number
    while (ticksLeft >= 0) {
      const [_, dur] = measure(this.doTick)
      tickDuration = dur
      ticksLeft--
    }

    if (lastTicks.length >= this.memory) lastTicks.shift()
    lastTicks.push(tickDuration)

    const stats = this.calculateStats(now)

    this.lastTick = now
    setTimeout(this.tick, stats.untilNextTick)
  }

  private calculateStats(now: DOMHighResTimeStamp): TickStats {
    const { lags, lastTicks, targetTickTime } = this
    const sinceLastTick = now - this.lastTick

    const scheduleLag = Math.max(0, sinceLastTick - this.lastTickDuration)
    if (lags.length >= this.memory) lags.shift()
    lags.push(scheduleLag)

    const avgLag = Math.ceil(lags.reduce((a, b) => a + b) / lags.length)

    const avgTickDuration = lastTicks.reduce((a, b) => a + b) / lastTicks.length
    const untilNextTick = Math.max(
      0,
      targetTickTime - Math.ceil(avgTickDuration + avgLag + 1),
    )

    this.lastTickDuration = untilNextTick

    const stats: TickStats = {
      now,
      sinceLastTick,
      untilNextTick,
      targetTickTime,
      avgTickDuration,
      avgLag,
    }

    this.tryEmitStats(stats)
    if (sinceLastTick > targetTickTime) {
      this.emitter.emit('slow', stats)
    }

    return stats
  }
}
