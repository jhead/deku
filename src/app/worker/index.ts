import { AppContext } from '../AppContext'

const loadedWorkers: Worker[] = []

export const createWorker = (ctx: AppContext) => {
  const worker = loadWorker()
  worker.onmessage = handleMessageFromWorker(ctx)
  loadedWorkers.push(worker)
  return worker
}

export const stopAllWorkers = () => {
  loadedWorkers.forEach((worker) => {
    console.debug('Killing existing worker', worker)
    worker.terminate()
  })
}

const loadWorker = (): Worker =>
  new Worker(new URL('./Worker.ts', import.meta.url), {
    type: 'module',
  })

const handleMessageFromWorker =
  (ctx: AppContext) =>
  ({ data }: MessageEvent) => {
    ctx.eventing.emit(data.type, data)
  }
