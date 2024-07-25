import { SeekerLead } from '@/app/coaches/types'
import { useAuthenticatedQuery } from '@/app/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export const useCoachLeadsQuery = () =>
  useAuthenticatedQuery(['coachLeads'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<SeekerLead[]>(`/coaches/leads/`, token)

      return res.data
    }

    return getCoachSeekersRequest()
  })
