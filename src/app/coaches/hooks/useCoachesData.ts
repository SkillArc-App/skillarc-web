import { Coach } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachesData = () =>
  useAuthenticatedQuery(['coaches'], ({ token }) => {
    if (!token) return Promise.reject('No user id')

    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/`, token, { camel: false })

      return res.data
    }

    return getCoachesRequest()
  })
