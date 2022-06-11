import * as pixi from 'pixi.js'
import { AppContext } from './AppContext'
import { EventEmitter } from './EventEmitter'
import { RenderAdapter } from './render/RenderAdapter'

export const createCanvas = (root: HTMLElement) => {
  const app = new pixi.Application()
  root.appendChild(app.view)
  app.start()

  const ctx: AppContext = {
    app,
    eventing: new EventEmitter(),
    entityToObject: {},
  }

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
