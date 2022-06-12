import { emptyState } from "..";
import { EngineState } from "../Engine";

export interface StateStore {
  load(): Promise<EngineState>
  store(state: EngineState): Promise<void>
  clear(): Promise<void>
}

export const NoOpStateStore: StateStore = {
  load: async () => emptyState(),
  store: async (state) => {},
  clear: async () => {},
}
