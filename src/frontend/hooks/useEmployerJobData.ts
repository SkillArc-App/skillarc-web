import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendEmployerJobsService } from '../services/employerJobs.service'

export const useEmployerJobData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getEmployerJobs = useQuery(['employer_jobs', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerJobsService.get(token)
  })

  return { getEmployerJobs }
}
