import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendJobService } from '../services/jobs.service'

export const useAllJobData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getJobs = useQuery(['jobs', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendJobService.getAll(token)
  })

  return { getJobs }
}

export const useJobData = (id: string) => {
  const getOneJob = useQuery(['job', id], () => {
    return FrontendJobService.getOne(id)
  })

  useEffect(() => {
    getOneJob.refetch()
  }, [id])

  return { getOneJob }
}
