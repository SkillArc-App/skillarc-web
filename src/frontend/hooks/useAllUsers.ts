import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllUsers = () => {
  const allUsersQuery = useAuthenticatedQuery(['allUsers'], ({ token }) => {
    if (process.env.NODE_ENV !== 'development') {
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
