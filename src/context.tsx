import { theme } from 'antd'
import React, { createContext, useState } from 'react'

const AppContext = createContext<any>({})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [globalData, setGlobalData] = useState({
    theme: theme.defaultAlgorithm,
    menuCollapsed: false,
    drawer: false,
  })

  return (
    <AppContext.Provider value={{ globalData, setGlobalData }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
