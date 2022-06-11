import { useEffect, useRef, useState } from 'react'
import { Editor } from './editor/Editor'
import { createCanvas } from '../canvas'

export const App: React.FC = () => {
  return (
    <>
      <Canvas />
      <Editor />
    </>
  )
}

export const Canvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded && ref.current) {
      setLoaded(true)
      createCanvas(ref.current)
    }
  }, [ref])

  return <div ref={ref} id="canvas-root"></div>
}
