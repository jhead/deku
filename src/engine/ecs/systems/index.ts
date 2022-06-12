import { RenderSystem } from './Render'
import { PhysicsSystem } from './Physics'
import { System } from '../../../api/ecs/System'

export const AllSystems: readonly System[] = [RenderSystem, PhysicsSystem]
