import { AppContext } from '../AppContext'

export namespace WorkerBridge {
  export const registerEventHandlers = (worker: Worker, ctx: AppContext) => {
    ctx.eventing.addEventsListener('Worker', (events) =>
      worker.postMessage(events),
    )
  }
}
