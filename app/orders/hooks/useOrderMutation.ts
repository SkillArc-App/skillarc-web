import { useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedMutation } from 'app/hooks/useAuthenticatedMutation'
import { put } from 'app/http-common'

type OrderParams = {
  id: string
  orderCount: number
}

export const useOrderMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ id, orderCount }: OrderParams, token: string) => {
      const result = await put(
        `job_orders/orders/${id}`,
        {
          orderCount,
        },
        token,
      )

      return result.data
    },
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['jobOrder', id])
        queryClient.invalidateQueries(['jobOrders'])
      },
    },
  )
}
