import React, { useContext, useEffect, useRef, useState } from 'react'
import { createCanvas } from '../canvas'
import { AppLifecycle } from './AppLifecycle'
import { DekuContext } from './context/DekuContext'
import { Editor } from './editor/Editor'

export const App: React.FC = () => {
  return (
    <>
      <AppLifecycle>
        <Canvas />
        <Editor />
      </AppLifecycle>
    </>
  )
}

const Canvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>()
  const [loaded, setLoaded] = useState(false)
  const ctx = useContext(DekuContext)

  useEffect(() => {
    if (!loaded && ref.current && ctx.app.stage) {
      setLoaded(true)
      createCanvas(ctx, ref.current)
    }
  }, [ref, ctx])

  return <div ref={ref} id="canvas-root"></div>
}
