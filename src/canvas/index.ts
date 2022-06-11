import { AppContext } from '../app/AppContext'
import { RenderAdapter } from './render/RenderAdapter'

export const createCanvas = (ctx: AppContext, root: HTMLElement) => {
  root.appendChild(ctx.app.view)
  RenderAdapter.registerEventHandlers(ctx)
  createWorker().onmessage = handleMessageFromWorker(ctx)
}

const createWorker = (): Worker =>
  new Worker(new URL('./worker/worker.ts', import.meta.url), {
    type: 'module',
  })

const handleMessageFromWorker =
  (ctx: AppContext) =>
  ({ data }: MessageEvent) =>
    ctx.eventing.emit(data.type, data)
