import { useQuery } from '@tanstack/react-query'
import { get } from '../../http-common'

export const useAllUsers = () => {
  const allUsersQuery = useQuery(['allUsers'], () => {
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
