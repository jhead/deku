import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { AppContext, createApplication } from '../app/AppContext'
import { createCanvas } from '../canvas'
import { Editor } from './editor/Editor'

const ReactAppContext = React.createContext<AppContext>(undefined)

export const App: React.FC = () => {
  return (
    <>
      <AppContextManager>
        <Canvas />
        <Editor />
      </AppContextManager>
    </>
  )
}

export const AppContextManager: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [ctx, setContext] = useState<AppContext>(createApplication())

  useEffect(() => {
    return () => {
      if (ctx.app.stage) {
        ctx.app.destroy()
        setContext(createApplication())
      }
    }
  })

  return (
    <ReactAppContext.Provider value={ctx}>{children}</ReactAppContext.Provider>
  )
}

export const Canvas: React.FC = () => {
  const ref = useRef<HTMLDivElement>()
  const [loaded, setLoaded] = useState(false)
  const ctx = useContext(ReactAppContext)

  useEffect(() => {
    if (!loaded && ref.current && ctx.app.stage) {
      setLoaded(true)
      createCanvas(ctx, ref.current)
    }
  }, [ref, ctx])

  return <div ref={ref} id="canvas-root"></div>
}
