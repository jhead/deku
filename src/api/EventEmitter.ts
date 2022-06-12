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

export class EventQueue<T> extends EventEmitter<T> {
  constructor(
    private queues: Record<string, T[]> = {},
    handlers: Record<string, EventHandler<T>[]> = {},
  ) {
    super(handlers)
  }

  override emit(eventType: string, event: T): void {
    if (!this.queues[eventType]) {
      this.queues[eventType] = []
    }

    this.queues[eventType].push(event)
  }

  flush() {
    const queues = this.queues
    this.queues = {}

    Object.entries(queues).forEach(([eventType, events]) => {
      events.forEach((event) => super.emit(eventType, event))
    })

    return queues
  }

  protected override emitToHandler(event: T, handler: EventHandler<T>) {
    handler(event)
  }
}
