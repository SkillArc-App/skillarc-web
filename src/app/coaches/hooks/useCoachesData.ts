import { Coach } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachesData = () =>
  useAuthenticatedQuery(['coaches'], ({ token }) => {
    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`/coaches/`, token)

      return res.data
    }

    return getCoachesRequest()
  })
