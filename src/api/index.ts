import { config } from '../config'
import { IFetchApiOption } from '../types'

const baseURL = `${config.ip}:3402/api`

const fetchApiOptionCollection: {
  [K: string | number | symbol]: IFetchApiOption<any>
} = {
  userRead: {
    method: 'post',
    url: '/user/read',
  },
  userCreate: {
    method: 'post',
    url: '/user/create',
  },
  userUpdate: {
    method: 'put',
    url: '/user/update',
  },
  userDelete: {
    method: 'delete',
    url: '/user/delete',
  },
  roleRead: {
    method: 'get',
    url: '/role/read',
  },
  addressRead: {
    method: 'get',
    url: '/address/read',
  },
  fieldRead: {
    method: 'post',
    url: '/field/read',
  },
  fieldCreate: {
    method: 'post',
    url: '/field/create',
  },
  fieldUpdate: {
    method: 'put',
    url: '/field/update',
  },
  fieldDelete: {
    method: 'delete',
    url: '/field/delete',
  },
  facilitiesRead: {
    method: 'post',
    url: '/facilities/read',
  },
  facilitiesCreate: {
    method: 'post',
    url: '/facilities/create',
  },
  facilitiesUpdate: {
    method: 'put',
    url: '/facilities/update',
  },
  facilitiesDelete: {
    method: 'delete',
    url: '/facilities/delete',
  },
  powerRead: {
    method: 'get',
    url: '/power/read',
  },
  userFieldRead: {
    method: 'post',
    url: '/userField/read',
  },
  userFieldCreate: {
    method: 'post',
    url: '/userField/create',
  },
  userFieldUpdate: {
    method: 'put',
    url: '/userField/update',
  },
  userFieldDelete: {
    method: 'delete',
    url: '/userField/delete',
  },
}

export { baseURL, fetchApiOptionCollection }
