import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'
import { Team } from '../types'

export const useTeamsQuery = () =>
  useAuthenticatedQuery(['teams', 'teams'], ({ token }) => {
    const getTeams = async () => {
      const res = await get<Team[]>(`teams/teams`, token)

      return res.data
    }

    return getTeams()
  })
