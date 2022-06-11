import { Square } from '../../canvas/objects/Square'
import { Engine } from '../../engine'

onmessage = (event) => {
  console.log('worker msg: ', event)
}

// TODO
const testEntities = [
  new Square({ position: { x: 50, y: 50 } }),
  new Square({ velocity: { x: 1, y: 1 } }),
]

console.debug('worker loaded')

const startEngine = () => {
  const engine = new Engine(new Set(testEntities))
  engine.onEngineEvent((event) => postMessage(event))
  engine.start()
}

startEngine()
