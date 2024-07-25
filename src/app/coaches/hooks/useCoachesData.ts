import { Coach } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/app/hooks/useAuthenticatedQuery'
import { get } from '@/app/http-common'

export const useCoachesData = () =>
  useAuthenticatedQuery(['coaches'], ({ token }) => {
    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`/coaches/`, token)

      return res.data
    }

    return getCoachesRequest()
  })
