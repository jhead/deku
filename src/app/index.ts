import * as pixi from 'pixi.js'
import { RenderEvent } from '../engine/ecs/systems/Render'
import { AppContext } from './AppContext'
import { Reducer, Reducers } from './render/Reducers'

const app = new pixi.Application()
const ctx: AppContext = {
  app,
  entityToObject: {},
}

export const bootApplication = () => {
  document.getElementById('root').appendChild(app.view)
  app.start()

  createWorker().onmessage = ({ data }: { data: RenderEvent }) => {
    const reducer = Reducers[data.type] as Reducer<typeof data>
    reducer(ctx, app.stage, data)
  }
}

const createWorker = (): Worker =>
  new Worker(new URL('./worker/worker.ts', import.meta.url), {
    type: 'module',
  })
