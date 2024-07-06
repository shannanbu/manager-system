import { createBrowserRouter, RouteObject } from 'react-router-dom'
import React from 'react'
import UserManager from './userManager'
import FieldManager from './fieldManager'
import FacilitiFesManager from './facilitiesManager'
import UserFieldManager from './userFieldManager'

export const routes: (RouteObject & {
  label?: string
})[] = [
  {
    path: '/',
    label: '用户管理',
    element: <UserManager />,
  },
  {
    path: 'field',
    label: '场地管理',
    element: <FieldManager />,
  },
  {
    path: 'facilities',
    label: '设施管理',
    element: <FacilitiFesManager />,
  },
  {
    path: 'userField',
    label: '用户场地管理',
    element: <UserFieldManager />,
  },
]

const router = createBrowserRouter(routes)

export default router
