import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'
import { JobOrderSummary } from '../types'

export const useOrdersQuery = () =>
  useAuthenticatedQuery(['jobOrders'], ({ token }) => {
    const getOrders = async () => {
      const res = await get<JobOrderSummary[]>(`job_orders/orders`, token)

      return res.data
    }

    return getOrders()
  })
