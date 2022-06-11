import { Square } from '../../api/obj/Square'
import { Scale } from '../../api/types/Geom'
import { Engine, EngineState } from '../../engine'
import { connectDatabase, loadEngineState, storeEngineState } from './StateDB'

console.debug('worker loaded')

const startEngine = async () => {
  const db = await connectDatabase()
  const initialState = await loadEngineState(db)

  const engine = new Engine(initialState)
  setInterval(() => storeEngineState(db, engine), 500)

  // TODO
  createTestEntities(engine)

  engine.onEngineEvent((event) => postMessage(event))

  self.onmessage = ({ data }) => {
    console.debug('worker msg: ', data)
    engine.sendCommand(data)
  }

  engine.start()
}

const createTestEntities = (engine: Engine) => {
  setInterval(() => {
    const size = Scale.Static(5 + Math.random() * 25)

    engine.sendCommand({
      type: 'PutEntity',
      entity: new Square({
        size: {
          width: size,
          height: size,
        },
        velocity: {
          x: Math.random() * 3,
          y: Math.random() * 3,
        },
      }),
    })
  }, 500)
}

startEngine()
