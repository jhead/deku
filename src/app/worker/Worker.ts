import { EngineEvent } from '../../api/event/EngineEventAPI'
import { Square } from '../../api/obj/Square'
import { Scale } from '../../api/types/Geom'
import { Engine } from '../../engine'
import { StateDB } from './StateDB'

console.debug('Worker loaded!')

const startEngine = async () => {
  console.debug('Starting engine')

  const stateStore = await StateDB.create()
  const engine = new Engine(stateStore)

  // TODO
  createTestEntities(engine)

  engine.onEngineEvent((event) => {
    postMessage(event)
  })

  self.onmessage = ({ data }) => {
    console.debug('worker msg: ', data)
    engine.sendCommand(data)
  }

  engine.start()
  console.log('Engine started!')
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
  }, 50)
}

startEngine()
