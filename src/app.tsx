import React from 'react'
import Layout from './layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import { AppProvider } from './context'
import { App as AppAntd } from 'antd'

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppProvider>
          <AppAntd>
            <Layout>
              <Routes>
                {routes.map((route) => (
                  <Route
                    path={route.path}
                    element={route.element}
                    key={route.path}
                  ></Route>
                ))}
              </Routes>
            </Layout>
          </AppAntd>
        </AppProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default App
