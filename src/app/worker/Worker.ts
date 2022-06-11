import { Square } from '../../api/obj/Square'
import { Engine } from '../../engine'

// TODO
const testEntities = [
  new Square({ position: { x: 50, y: 50 } }),
  new Square({ velocity: { x: 1, y: 1 } }),
]

console.debug('worker loaded')

const startEngine = () => {
  const engine = new Engine()

  // TODO
  testEntities.forEach((entity) => {
    engine.sendCommand({
      type: 'PutEntity',
      entity,
    })
  })

  engine.onEngineEvent((event) => postMessage(event))

  self.onmessage = ({ data }) => {
    console.debug('worker msg: ', data)
    engine.sendCommand(data)
  }

  engine.start()
}

startEngine()
