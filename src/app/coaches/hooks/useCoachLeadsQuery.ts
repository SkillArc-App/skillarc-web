import { SeekerLead } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachLeadsQuery = () =>
  useAuthenticatedQuery(['coachLeads'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<SeekerLead[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/leads/`,
        token,
        { camel: true },
      )

      return res.data
    }

    return getCoachSeekersRequest()
  })
