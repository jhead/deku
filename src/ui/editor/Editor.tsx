import React from 'react'

export const Editor: React.FC = () => {
  const onClick = () => {
    console.log('hello')
  }
  return <button onClick={onClick}>Test</button>
}
