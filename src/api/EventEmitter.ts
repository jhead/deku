import '../ext'

export interface IEvent {
  type: string
}

export type EventHandler<T> = (event: T) => void

export class EventEmitter<T> {
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

  emit(eventType: string, event: T) {
    const handlersForEvent = this.handlers[eventType] || []
    handlersForEvent.forEach((handler) => this.emitToHandler(event, handler))
  }

  private emitToHandler(event: T, handler: EventHandler<T>) {
    setTimeout(() => handler(event), 0)
  }
}
