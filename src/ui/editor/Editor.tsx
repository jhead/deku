import React, { useContext } from 'react'
import { EntityCommand } from '../../api/event/EngineEventAPI'
import { Square } from '../../api/obj/Square'
import { DekuContext } from '../context/DekuContext'

export const Editor: React.FC = () => {
  return (
    <>
      <TestButton />
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

const TestButton: React.FC = () => {
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

  return <button onClick={onClick}>Test</button>
}
