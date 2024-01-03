import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export const useApplicationAnalytics = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getApplicationAnalytics = useQuery(['applicationAnalytics', token], () => {
    if (!token) return Promise.reject('No token')

    const getApplicationAnalytics = async () => {
      const res = await get<{
        averageStatusTimes: { status: string; time: { days: number; hours: number } }[]
        currentStatusTimes: {
          id: string
          applicant_name: string
          employment_title: string
          employer_name: string
          status: string
          time: { days: number; hours: number }
        }[]
      }>(`${process.env.NEXT_PUBLIC_API_URL}/admin/application_analytics/`, token)

      return res.data
    }

    return getApplicationAnalytics()
  })

  return getApplicationAnalytics
}
