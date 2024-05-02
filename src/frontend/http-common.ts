import axios, { AxiosResponse } from 'axios'
import qs from 'qs'

type Headers = {
  'Key-Inflection'?: 'camel'
  Authorization?: string
}

type Options = {
  camel?: boolean
}

const http = axios.create({
  withCredentials: false,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-type': 'application/json',
    'Key-Inflection': 'camel'
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
})

export const get = <T = any, D = any>(
  url: string,
  token?: string,
  params?: any,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return http.get<T>(url, {
    headers,
    params,
  })
}

export const post = <T = any, D = any>(
  url: string,
  data: any,
  token: string,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  return http.post(url, data, {
    headers,
  })
}

export const put = <T = any, D = any>(
  url: string,
  data: any,
  token: string,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  return http.put(url, data, {
    headers,
  })
}

export const destroy = <T = any, D = any>(
  url: string,
  token: string,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  return http.delete(url, {
    headers,
  })
}
