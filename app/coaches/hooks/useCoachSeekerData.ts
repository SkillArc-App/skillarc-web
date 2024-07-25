import { CoachSeeker } from '@/coaches/types'
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export const useCoachSeekerData = (id?: string) =>
  useAuthenticatedQuery(
    ['coachSeeker', id],
    ({ token }) => {
      const getCoachSeekerRequest = async () => {
        const res = await get<CoachSeeker>(`/coaches/contexts/${id}`, token)

        return res.data
      }

      return getCoachSeekerRequest()
    },
    { enabled: !!id },
  )
