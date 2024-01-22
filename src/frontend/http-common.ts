import axios, { AxiosResponse } from 'axios'

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
})

export const get = <T>(
  url: string,
  token?: string,
  options?: Options,
): Promise<AxiosResponse<T>> => {
  const headers: Headers = {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options?.camel) {
    headers['Key-Inflection'] = 'camel'
  }

  return http.get<T>(url, {
    headers,
  })
}

export const post = (url: string, data: any, token: string, options?: Options) => {
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

export const put = (url: string, data: any, token: string, options?: Options) => {
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

export const destroy = (url: string, token: string, options?: Options) => {
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
