import { CoachSeekerTable } from '@/coaches/types'
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export const useCoachSeekersData = () =>
  useAuthenticatedQuery(['coachSeekers'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<CoachSeekerTable[]>(`/coaches/contexts/`, token)

      return res.data
    }

    return getCoachSeekersRequest()
  })
