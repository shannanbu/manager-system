import React, { useContext, useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, ConfigProvider, Drawer, Menu, Switch, theme } from 'antd'
import { routes } from './routes'
import { useNavigate } from 'react-router-dom'
import AppContext from './context'

type MenuItem = Required<MenuProps>['items'][number]

const items: MenuItem[] = routes.map((route) => ({
  key: route.path,
  label: route.label,
  icon: <AppstoreOutlined />,
}))

export interface LayoutProps {
  children?: React.ReactNode
}

const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children }, ref) => {
    const { globalData, setGlobalData } = useContext(AppContext)
    const navigate = useNavigate()

    const toggleCollapsed = () => {
      setGlobalData({
        ...globalData,
        menuCollapsed: !globalData.menuCollapsed,
      })
    }

    const onClick: MenuProps['onClick'] = (e: any) => {
      navigate(e.key)
    }

    const toggleDrawer = (drawer: boolean) => {
      setGlobalData({
        ...globalData,
        drawer: drawer,
      })
    }

    const toggleTheme = () => {
      setGlobalData({
        ...globalData,
        theme:
          globalData.theme === theme.defaultAlgorithm
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      })
    }

    useEffect(() => {
      if (globalData.theme === theme.defaultAlgorithm) {
        document.documentElement.classList.remove('dark')
      } else {
        document.documentElement.classList.add('dark')
      }
    }, [globalData.theme])

    return (
      <ConfigProvider theme={{ algorithm: globalData.theme }}>
        <div className={`h-screen flex flex-col overflow-hidden`}>
          <div
            className={`p-4 flex justify-between border-b border-main dark:border-main-dark dark:bg-black dark:text-white`}
          >
            <div className="flex items-end">
              <Avatar icon={<UserOutlined />} />
              <div className="pl-1">alsudgaud</div>
            </div>
            <div className="flex items-end">
              <SettingOutlined onClick={() => toggleDrawer(true)} />
            </div>
          </div>
          <div className="flex-1 flex" ref={ref}>
            <div
              className={`h-full transition-all duration-700 ${!globalData.menuCollapsed ? 'w-64' : ''}`}
            >
              <Menu
                className="h-full"
                defaultSelectedKeys={[routes[0].path]}
                mode="inline"
                theme="light"
                inlineCollapsed={globalData.menuCollapsed}
                items={items}
                onClick={onClick}
              />
            </div>
            <div className="px-1 pt-1 flex-1 transition-all duration-700 dark:bg-black dark:text-white">
              {children}
            </div>
          </div>
          <Drawer
            title="settings"
            open={globalData.drawer}
            onClose={() => toggleDrawer(false)}
          >
            <div>
              <Switch
                className="mr-1"
                checked={globalData.theme === theme.defaultAlgorithm}
                onChange={toggleTheme}
              />
              <span>切换主题</span>
            </div>
            <div>
              <Switch
                className="mr-1"
                checked={globalData.menuCollapsed}
                onChange={toggleCollapsed}
              />
              <span>菜单折叠</span>
            </div>
          </Drawer>
        </div>
      </ConfigProvider>
    )
  }
)

export default Layout
