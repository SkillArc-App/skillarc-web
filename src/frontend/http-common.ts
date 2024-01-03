import axios, { AxiosResponse } from 'axios'
export const http = axios.create({
  withCredentials: false,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
})

export const get = <T>(url: string, token?: string): Promise<AxiosResponse<T>> => {
  return http.get<T>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const post = (url: string, data: any, token: string) => {
  return http.post(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const put = (url: string, data: any, token: string) => {
  return http.put(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const destroy = (url: string, token: string) => {
  return http.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
