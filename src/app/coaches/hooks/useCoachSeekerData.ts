import { CoachSeeker } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachSeekerData = (id?: string) =>
  useAuthenticatedQuery(
    ['coachSeeker', id],
    ({ token }) => {
      const getCoachSeekerRequest = async () => {
        const res = await get<CoachSeeker>(
          `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}`,
          token,
        )

        return res.data
      }

      return getCoachSeekerRequest()
    },
    { enabled: !!id },
  )
