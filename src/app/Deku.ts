import { RenderAdapter } from '../canvas/render/RenderAdapter'
import { AppContext, newAppContext } from './AppContext'
import { createWorker, stopAllWorkers } from './worker'

export const startApplication = (
  ctx: AppContext = newAppContext(),
): AppContext => {
  console.log('Starting app', ctx)
  stopAllWorkers()
  createWorker(ctx)
  RenderAdapter.registerEventHandlers(ctx)
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
