import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { JobOrder } from '../types'

export const useOrderData = (id: string) =>
  useAuthenticatedQuery(['jobOrder', id], ({ token }) => {
    const getOrder = async () => {
      const res = await get<JobOrder>(`job_orders/orders/${id}`, token)

      return res.data
    }

    return getOrder()
  })
