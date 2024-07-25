import { SeekerLead } from '@/coaches/types'
import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export const useCoachLeadsQuery = () =>
  useAuthenticatedQuery(['coachLeads'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<SeekerLead[]>(`/coaches/leads/`, token)

      return res.data
    }

    return getCoachSeekersRequest()
  })
