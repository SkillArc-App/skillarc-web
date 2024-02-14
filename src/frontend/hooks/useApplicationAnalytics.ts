import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useApplicationAnalytics = () => {
  const getApplicationAnalytics = useAuthenticatedQuery(['applicationAnalytics'], ({ token }) => {
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
      }>(`${process.env.NEXT_PUBLIC_API_URL}/admin/application_analytics/`, token, { camel: false })

      return res.data
    }

    return getApplicationAnalytics()
  })

  return getApplicationAnalytics
}
