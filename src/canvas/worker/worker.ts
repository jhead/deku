import { startEngine } from '../../engine'
import { Square } from '../objects/Square'

onmessage = (event) => {
  console.log('worker msg: ', event)
}

// TODO
const testEntities = [
  new Square({ position: { x: 50, y: 50 } }),
  new Square({ velocity: { x: 1, y: 1 } }),
]

startEngine(testEntities, (event) => postMessage(event))
