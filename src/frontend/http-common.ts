import axios, { AxiosResponse } from 'axios'
import qs from 'qs'

type Headers = {
  'Key-Inflection'?: 'camel'
  Authorization?: string
}

type Options = {
  camel?: boolean
}

export const http = axios.create({
  withCredentials: false,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
})

export const get = <T = any, D = any>(
  url: string,
  token?: string,
  options?: Options,
  params?: any,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options?.camel) {
    headers['Key-Inflection'] = 'camel'
  }

  console.log(params)

  return http.get<T>(url, {
    headers,
    params,
  })
}

export const post = <T = any, D = any>(
  url: string,
  data: any,
  token: string,
  options?: Options,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  if (options?.camel) {
    headers['Key-Inflection'] = 'camel'
  }

  return http.post(url, data, {
    headers,
  })
}

export const put = <T = any, D = any>(
  url: string,
  data: any,
  token: string,
  options?: Options,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  if (options?.camel) {
    headers['Key-Inflection'] = 'camel'
  }

  return http.put(url, data, {
    headers,
  })
}

export const destroy = <T = any, D = any>(
  url: string,
  token: string,
  options?: Options,
): Promise<AxiosResponse<T, D>> => {
  const headers: Headers = {
    Authorization: `Bearer ${token}`,
  }

  if (options?.camel) {
    headers['Key-Inflection'] = 'camel'
  }

  return http.delete(url, {
    headers,
  })
}
