import { AppContext, newAppContext } from './AppContext'
import { createWorker, stopWorker } from './worker'
import { RenderAdapter } from '../canvas/render/RenderAdapter'

export const startApplication = (
  ctx: AppContext = newAppContext(),
): AppContext => {
  console.log('Starting app', ctx)
  stopWorker()
  createWorker(ctx)
  RenderAdapter.registerEventHandlers(ctx)
  ctx.app.start()
  return ctx
}

export const stopApplication = (ctx: AppContext) => {
  console.log('Stopping app', ctx)

  ctx.eventing.clear()
  stopWorker()

  if (ctx.app.stage) {
    ctx.app.destroy()
  }
}
