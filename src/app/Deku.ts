import { RenderAdapter } from '../canvas/render/RenderAdapter'
import { AppContext, newAppContext } from './AppContext'
import { createWorker, stopAllWorkers } from './worker'
import { WorkerBridge } from './worker/WorkerBridge'

export const startApplication = (
  ctx: AppContext = newAppContext(),
): AppContext => {
  console.log('Starting app', ctx)
  
  stopAllWorkers()
  const worker = createWorker(ctx)
  
  RenderAdapter.registerEventHandlers(ctx)
  WorkerBridge.registerEventHandlers(worker, ctx)

  ctx.app.ticker.add(() => ctx.eventing.flush())
  
  ctx.app.start()
  return ctx
}

export const stopApplication = (ctx: AppContext) => {
  console.log('Stopping app', ctx)

  ctx.eventing.clear()
  stopAllWorkers()

  if (ctx.app.stage) {
    ctx.app.destroy()
  }
}
