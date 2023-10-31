import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendJobService } from '../services/jobs.service'

export const useJobMatchData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const jobMatchesQuery = useQuery(['jobMatches', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendJobService.getJobMatches(token)
  })

  useEffect(() => {
    jobMatchesQuery.refetch()
  }, [token])

  return { jobMatchesQuery }
}
