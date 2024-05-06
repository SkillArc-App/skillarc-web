import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useApplicationAnalytics = () => {
  const getApplicationAnalytics = useAuthenticatedQuery(['applicationAnalytics'], ({ token }) => {
    const getApplicationAnalytics = async () => {
      const res = await get<{
        averageStatusTimes: { status: string; time: { days: number; hours: number } }[]
        currentStatusTimes: {
          id: string
          applicantName: string
          employmentTitle: string
          employerName: string
          status: string
          time: { days: number; hours: number }
        }[]
      }>(`/admin/application_analytics/`, token)

      return res.data
    }

    return getApplicationAnalytics()
  })

  return getApplicationAnalytics
}
