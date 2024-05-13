import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { JobOrderSummary } from '../types'

export const useOrdersData = () =>
  useAuthenticatedQuery(['jobOrders'], ({ token }) => {
    const getOrders = async () => {
      const res = await get<JobOrderSummary[]>(`job_orders/orders`, token)

      return res.data
    }

    return getOrders()
  })
