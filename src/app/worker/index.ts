import { AppContext } from '../AppContext'

let currentWorker: Worker

export const createWorker = (ctx: AppContext) => {
  stopWorker()
  currentWorker = loadWorker()
  currentWorker.onmessage = handleMessageFromWorker(ctx)
  return currentWorker
}

export const stopWorker = () => {
  if (currentWorker) {
    console.debug('Killing existing worker', currentWorker)
    currentWorker.terminate()
  }
}

const loadWorker = (): Worker =>
  new Worker(new URL('./Worker.ts', import.meta.url), {
    type: 'module',
  })

const handleMessageFromWorker =
  (ctx: AppContext) =>
  ({ data }: MessageEvent) => {
    console.debug('msg from worker', data)
    ctx.eventing.emit(data.type, data)
  }
