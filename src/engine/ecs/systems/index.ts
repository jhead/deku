import { RenderSystem } from './Render'
import { PhysicsSystem } from './Physics'
import { System } from '../../../api/ecs/System'
import { Reaper } from './Reaper'
import { ChangeObserver } from './ChangeObserver'

export const AllSystems: readonly System[] = [
  ChangeObserver,
  RenderSystem,
  PhysicsSystem,
  Reaper,
]
