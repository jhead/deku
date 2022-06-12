import { RenderSystem } from './Render'
import { PhysicsSystem } from './Physics'
import { System } from '../../../api/ecs/System'
import { Reaper } from './Reaper'

export const AllSystems: readonly System[] = [
  RenderSystem,
  PhysicsSystem,
  Reaper,
]
