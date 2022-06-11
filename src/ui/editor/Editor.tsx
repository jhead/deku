import React, { useContext } from 'react'
import { DekuContext } from '../context/DekuContext'

export const Editor: React.FC = () => {
  const ctx = useContext(DekuContext)
  const onClick = () => {
    ctx.eventing.emit('Worker', { type: 'PutEntity' })
    console.log('hello')
  }
  return <button onClick={onClick}>Test</button>
}
