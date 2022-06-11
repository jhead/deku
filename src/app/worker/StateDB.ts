import pako from 'pako'
import { Engine, EngineState } from '../../engine'

const idbRequest = <T>(block: () => IDBRequest<T>): Promise<T> => {
  const req = block()
  return new Promise((resolve, reject) => {
    req.onsuccess = (event) => resolve((event.target as any).result)
    req.onerror = (err) => reject(err)
  })
}

const idbTransaction = (block: () => IDBTransaction): Promise<any> => {
  const req = block()
  return new Promise((resolve, reject) => {
    req.oncomplete = (event) => resolve(event)
    req.onerror = (event) => reject(event)
    req.onabort = (event) => reject(event)
  })
}

export const connectDatabase = async (): Promise<IDBDatabase> => {
  const init = async (event) => {
    console.log('Initializing new database')

    const db = event.target.result as IDBDatabase

    await idbTransaction(() => {
      const obj = db.createObjectStore('state')
      obj.createIndex('state', 'state', { unique: true })
      return obj.transaction
    })
  }

  return await idbRequest(() => {
    const req = indexedDB.open('engineState')
    req.onupgradeneeded = init
    return req
  })
}

export const getStateStore = (db: IDBDatabase): IDBObjectStore =>
  db.transaction('state', 'readwrite').objectStore('state')

export const loadEngineState = async (
  db: IDBDatabase,
): Promise<EngineState> => {
  const [rawExistingState] = await idbRequest(() => getStateStore(db).getAll())

  console.debug('Raw state size', rawExistingState.length)

  const initialState = rawExistingState
    ? decodeState(rawExistingState)
    : undefined

  console.log('Initial engine state', initialState)

  return initialState
}

const decodeState = (raw: Uint8Array): EngineState | undefined => {
  try {
    const inflatedBytes = pako.inflate(raw)
    const asJson = new TextDecoder().decode(inflatedBytes)
    return JSON.parse(asJson)
  } catch (err) {
    console.error(err)
    return undefined
  }
}

const encodeState = (state: EngineState): Uint8Array => {
  const asJson = JSON.stringify(state)
  const inputBytes = new TextEncoder().encode(asJson)
  return pako.deflate(inputBytes)
}

export const storeEngineState = async (
  db: IDBDatabase,
  engine: Engine,
): Promise<any> =>
  idbRequest(() =>
    getStateStore(db).put(encodeState(engine.currentState), 'state'),
  )
