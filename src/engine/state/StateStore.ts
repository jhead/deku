import { EngineState } from "../Engine";

export interface StateStore {
  load(): Promise<EngineState>
  store(state: EngineState): Promise<void>
  clear(): Promise<void>
}
