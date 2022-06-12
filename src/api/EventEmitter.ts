import '../ext'

export interface IEvent {
  type: string
}

export type EventHandler<T> = (event: T) => void

export interface IEventEmitter<T> {
  addEventListener<U extends T>(eventType: string, handler: EventHandler<U>)
  removeEventListener<U extends T>(eventType: string, handler: EventHandler<U>)
  emit<U extends T>(eventType: string, event: U)
  clear()
}

export class EventEmitter<T> implements IEventEmitter<T> {
  constructor(private handlers: Record<string, EventHandler<T>[]> = {}) {}

  addEventListener<U extends T>(eventType: string, handler: EventHandler<U>) {
    if (!(eventType in this.handlers)) {
      this.handlers[eventType] = []
    }

    this.handlers[eventType].push(handler as any) // TODO
  }

  removeEventListener<U extends T>(
    eventType: string,
    handler: EventHandler<U>,
  ) {
    const handlersForEvent = this.handlers[eventType] || []
    this.handlers[eventType] = handlersForEvent.filter((it) => it !== handler)
  }

  clear() {
    this.handlers = {}
  }

  emit<U extends T>(eventType: string, event: U) {
    const handlersForEvent = this.handlers[eventType] || []
    handlersForEvent.forEach((handler) => this.emitToHandler(event, handler))
  }

  protected emitToHandler(event: T, handler: EventHandler<T>) {
    setTimeout(() => handler(event), 0)
  }
}

export class EventQueue<T> {
  constructor(
    private queues: Record<string, T[]> = {},
    private handlers: Record<string, EventHandler<T[]>[]> = {},
  ) {}

  emit<U extends T>(eventType: string, event: U | U[]): void {
    if (!this.queues[eventType]) {
      this.queues[eventType] = []
    }

    const events = Array.isArray(event) ? event : [event]
    this.queues[eventType].push(...events)
  }

  addEventsListener<U extends T>(
    eventType: string,
    handler: EventHandler<U[]>,
  ) {
    if (!(eventType in this.handlers)) {
      this.handlers[eventType] = []
    }

    this.handlers[eventType].push(handler as any) // TODO
  }

  addEventListener<U extends T>(eventType: string, handler: EventHandler<U>) {
    this.addEventsListener<U>(eventType, (events) =>
      events.forEach((event) => handler(event)),
    )
  }

  // TODO
  removeEventListener<U extends T>(
    eventType: string,
    handler: EventHandler<U[]>,
  ) {
    const handlersForEvent = this.handlers[eventType] || []
    this.handlers[eventType] = handlersForEvent.filter((it) => it !== handler)
  }

  flush() {
    const queues = this.queues
    this.queues = {}

    Object.entries(queues).forEach(([eventType, events]) => {
      const handlersForEvent = this.handlers[eventType] || []
      handlersForEvent.forEach((handler) => this.emitToHandler(events, handler))
    })

    return queues
  }

  protected emitToHandler(events: T[], handler: EventHandler<T[]>) {
    handler(events)
  }
}
