import React, { useContext, useState } from 'react'
import { EntityCommand } from '../../api/event/EngineEventAPI'
import { Square } from '../../api/obj/Square'
import { Scale } from '../../api/types/Geom'
import { DekuContext } from '../context/DekuContext'

export const Editor: React.FC = () => {
  return (
    <>
      <AddObjectButton />
      <SpewButton />
      <ResetStateButton />
    </>
  )
}

const ResetStateButton: React.FC = () => {
  const ctx = useContext(DekuContext)

  const onClick = () => {
    ctx.eventing.emit('Worker', { type: 'ResetState' })
  }

  return <button onClick={onClick}>Reset</button>
}

const AddObjectButton: React.FC = () => {
  const ctx = useContext(DekuContext)

  const onClick = () => {
    ctx.eventing.emit<EntityCommand.PutEntity>('Worker', {
      type: 'PutEntity',
      entity: new Square({
        velocity: {
          x: Math.random() * 3,
          y: Math.random() * 3,
        },
      }),
    })
  }

  return <button onClick={onClick}>Add</button>
}

const SpewButton: React.FC = () => {
  const ctx = useContext(DekuContext)
  const [interval, saveInterval] = useState<number>()
  const enabled = typeof interval !== 'undefined'

  const createTestEntity = () => {
    const size = Scale.Static(5 + Math.random() * 25)

    ctx.eventing.emit<EntityCommand.PutEntity>('Worker', {
      type: 'PutEntity',
      entity: new Square({
        size: {
          width: size,
          height: size,
        },
        velocity: {
          x: Math.random() * 3,
          y: Math.random() * 3,
        },
      }),
    })
  }

  const onClick = () => {
    if (enabled) {
      clearInterval(interval)
      saveInterval(undefined)
    } else {
      saveInterval(setInterval(createTestEntity, 50))
    }
  }

  return <button onClick={onClick}>{!enabled ? 'Spew' : 'Unspew'}</button>
}
