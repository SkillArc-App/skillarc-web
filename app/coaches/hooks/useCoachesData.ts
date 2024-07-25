import { Coach } from '@/coaches/types'
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export const useCoachesData = () =>
  useAuthenticatedQuery(['coaches'], ({ token }) => {
    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`/coaches/`, token)

      return res.data
    }

    return getCoachesRequest()
  })
