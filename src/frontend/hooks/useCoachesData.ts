import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export type Coach = {
  id: string
  email: string
}

export const useCoachesData = () =>
  useAuthenticatedQuery(['coaches'], ({ token }) => {
    if (!token) return Promise.reject('No user id')

    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/`, token)

      return res.data
    }

    return getCoachesRequest()
  })
