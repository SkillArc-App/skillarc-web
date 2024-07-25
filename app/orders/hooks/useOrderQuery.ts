import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'
import { JobOrder } from '../types'

export const useOrderQuery = (id: string) =>
  useAuthenticatedQuery(['jobOrder', id], ({ token }) => {
    const getOrder = async () => {
      const res = await get<JobOrder>(`job_orders/orders/${id}`, token)

      return res.data
    }

    return getOrder()
  })
