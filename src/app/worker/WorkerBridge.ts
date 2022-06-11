import { AppContext } from '../AppContext'

export namespace WorkerBridge {
  export const registerEventHandlers = (worker: Worker, ctx: AppContext) => {
    ctx.eventing.addEventListener('Worker', (event) =>
      worker.postMessage(event),
    )
  }
}
