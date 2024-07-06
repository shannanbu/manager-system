import { baseURL } from '../api'
import { IFetchApiOption } from '../types/index'

const useFetchApi = () => {
  async function fetchApi<RequestT = any, ResponseT = any>({
    url,
    method,
    data,
  }: IFetchApiOption<RequestT>) {
    let init: RequestInit = {
      method,
    }
    if (data) {
      init.headers = {
        'Content-Type': 'application/json',
      }
      init.body = JSON.stringify(data)
    }

    const response = await fetch(`${baseURL}${url}`, init)

    const json: {
      data?: ResponseT
      message: string
    } = await response.json()

    return json
  }

  return {
    fetchApi,
  }
}

export { useFetchApi }
