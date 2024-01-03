import { OneMatchedJobPosting } from '@/pages/jobs'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export const useJobSavedData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const jobSavedQuery = useQuery(['jobMatches', token], () => {
    if (!token) return Promise.reject('No token')

    const getSaved = async () => {
      const res = await get<OneMatchedJobPosting[]>('seekers/jobs/saved', token)

      return res.data
    }

    return getSaved()
  })

  useEffect(() => {
    jobSavedQuery.refetch()
  }, [token])

  return { jobSavedQuery }
}
