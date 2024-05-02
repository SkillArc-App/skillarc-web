import { CoachSeekerTable } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachSeekersData = () =>
  useAuthenticatedQuery(['coachSeekers'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<CoachSeekerTable[]>(`/coaches/contexts/`, token)

      return res.data
    }

    return getCoachSeekersRequest()
  })
