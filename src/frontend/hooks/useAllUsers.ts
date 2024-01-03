import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export const useAllUsers = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

  const allUsersQuery = useQuery(['allUsers', token], () => {
    if (!token && process.env.NODE_ENV !== 'development') {
      return Promise.reject('No user id')
    }
    const getAll = async () => {
      const res = await get<{ id: string; email: string; sub: string }[]>('/admin/users')

      return res.data
    }
    return getAll()
  })

  return allUsersQuery
}
