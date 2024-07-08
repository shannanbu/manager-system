import { theme } from 'antd'
import { MapToken } from 'antd/es/theme/interface'
import { SeedToken } from 'antd/es/theme/internal'
import React, { createContext, useState } from 'react'

export interface IGlobalData {
  theme: (token: SeedToken) => MapToken
  menuCollapsed: boolean
  drawer: boolean
}

const AppContext = createContext<{
  globalData?: IGlobalData
  setGlobalData?: React.Dispatch<React.SetStateAction<IGlobalData>>
}>({})

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
