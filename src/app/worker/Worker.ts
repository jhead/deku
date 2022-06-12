import { Engine } from '../../engine'
import { StateDB } from './StateDB'

console.debug('Worker loaded!')

const startEngine = async () => {
  console.debug('Starting engine')

  const stateStore = await StateDB.create()
  const engine = new Engine(stateStore)

  engine.onEngineEvents((events) => {
    postMessage(events)
  })

  self.onmessage = ({ data }) => {
    const events = [data].flat()
    events.forEach((event) => engine.sendCommand(event))
  }

  engine.start()
  console.log('Engine started!')
}

startEngine()
