interface IRole {
  key: number
  name: string
}

interface IUser {
  key: number
  role: IRole
  name: string
  pwd: string
  contactPhone: string
}

interface IFetchApiOption<T> {
  method: 'get' | 'post' | 'put' | 'delete'
  url: string
  data?: T
}

interface ISqlRow<T> {
  insertData?: Partial<T>
  selectData?: Partial<T>
  updateData?: {
    newData: Partial<T>
    oldData: Partial<T>
  }
  deleteData?: Partial<T>
  rule?: {
    [k in keyof T]?: boolean
  }
  or?: boolean
}

interface IAddress {
  key: number
  name: string
}

interface IField {
  key: number
  name: string
  address: IAddress
}

interface IFacilities {
  key: number
  name: string
  field: IField
}

interface IUserField {
  key: string
  user: IUser
  field: IField
}

export {
  type IRole,
  type IUser,
  type IFetchApiOption,
  type ISqlRow,
  type IAddress,
  type IField,
  type IFacilities,
  type IUserField,
}
