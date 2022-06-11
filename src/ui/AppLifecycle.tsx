import React, { PropsWithChildren, useState, useEffect } from 'react'
import { AppContext } from '../app/AppContext'
import { startApplication, stopApplication } from '../app/Deku'
import { DekuContext } from './context/DekuContext'

export const AppLifecycle: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [ctx, setContext] = useState<AppContext>(startApplication)

  const onMount = () => onUnmount
  const onUnmount = () => {
    if (ctx.app.stage) {
      restartApplication()
    }
  }

  const restartApplication = () => {
    stopApplication(ctx)
    setContext(startApplication())
  }

  useEffect(onMount)

  return <DekuContext.Provider value={ctx}>{children}</DekuContext.Provider>
}
