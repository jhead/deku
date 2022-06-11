import { startEngine } from '../../engine'
import { Square } from '../../canvas/objects/Square'

onmessage = (event) => {
  console.log('worker msg: ', event)
}

// TODO
const testEntities = [
  new Square({ position: { x: 50, y: 50 } }),
  new Square({ velocity: { x: 1, y: 1 } }),
]

console.debug('worker loaded')
startEngine(testEntities, (event) => postMessage(event))
