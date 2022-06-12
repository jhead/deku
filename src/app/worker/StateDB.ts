import pako from 'pako'
import { emptyState, Engine, EngineState } from '../../engine'
import { StateStore } from '../../engine/state/StateStore'

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

const connectDatabase = async (): Promise<IDBDatabase> => {
  const init = async (event) => {
    console.log('Initializing new database')

    const db = event.target.result as IDBDatabase

    await idbTransaction(() => {
      const obj = db.createObjectStore('state')
      obj.createIndex('state', 'state', { unique: true })
      return obj.transaction
    })
  }

  console.log('Opening database')
  return await idbRequest(() => {
    const req = indexedDB.open('engineState')
    req.onupgradeneeded = init
    return req
  })
}

const getStateObjectStore = (db: IDBDatabase): IDBObjectStore =>
  db.transaction('state', 'readwrite').objectStore('state')

const loadEngineState = async (db: IDBDatabase): Promise<EngineState> => {
  const [rawExistingState] = await idbRequest(() =>
    getStateObjectStore(db).getAll(),
  )

  console.debug('Raw state size', rawExistingState?.size)

  const initialState = rawExistingState
    ? await decodeState(rawExistingState)
    : emptyState()

  console.log('Initial engine state', initialState)

  return initialState
}

const decodeState = async (raw: Blob): Promise<EngineState | undefined> => {
  try {
    const inflatedBytes = pako.inflate(await raw.arrayBuffer())
    const asJson = new TextDecoder().decode(inflatedBytes)
    return JSON.parse(asJson)
  } catch (err) {
    console.error(err)
    return undefined
  }
}

const encodeState = (state: EngineState): Blob => {
  const asJson = JSON.stringify(state)
  const bytes = pako.deflate(asJson)
  return new Blob([bytes])
}

const storeEngineState = async (
  db: IDBDatabase,
  state: EngineState,
): Promise<any> =>
  idbRequest(() => getStateObjectStore(db).put(encodeState(state), 'state'))

const clearEngineState = async (db: IDBDatabase): Promise<void> => {
  await storeEngineState(db, emptyState())
}

export class StateDB implements StateStore {
  constructor(private readonly db: IDBDatabase) {}

  static async create(): Promise<StateDB> {
    return new StateDB(await connectDatabase())
  }

  async load(): Promise<EngineState> {
    return await loadEngineState(this.db)
  }

  async store(state: EngineState): Promise<void> {
    return await storeEngineState(this.db, state)
  }

  async clear(): Promise<void> {
    return await clearEngineState(this.db)
  }
}
