import React, { useContext } from 'react'
import { Square } from '../../api/obj/Square'
import { DekuContext } from '../context/DekuContext'

export const Editor: React.FC = () => {
  const ctx = useContext(DekuContext)

  const onClick = () => {
    ctx.eventing.emit('Worker', {
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
