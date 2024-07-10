import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { Team } from '../types'

export const useTeamsQuery = () =>
  useAuthenticatedQuery(['teams', 'teams'], ({ token }) => {
    const getTeams = async () => {
      const res = await get<Team[]>(`teams/teams`, token)

      return res.data
    }

    return getTeams()
  })
