import { Engine } from '../../engine'
import { StateDB } from './StateDB'

console.debug('Worker loaded!')

const startEngine = async () => {
  console.debug('Starting engine')

  const stateStore = await StateDB.create()
  const engine = new Engine(stateStore)

  engine.onEngineEvent((event) => {
    postMessage(event)
  })

  self.onmessage = ({ data }) => {
    engine.sendCommand(data)
  }

  engine.start()
  console.log('Engine started!')
}

startEngine()
