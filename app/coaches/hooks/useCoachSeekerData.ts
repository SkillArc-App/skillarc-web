import { CoachSeeker } from 'app/coaches/types'
import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'

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
