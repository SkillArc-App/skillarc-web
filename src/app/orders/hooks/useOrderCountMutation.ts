import { useAuthenticatedMutation } from '@/app/hooks/useAuthenticatedMutation'
import { put } from '@/app/http-common'
import { useQueryClient } from '@tanstack/react-query'

type OrderParams = {
  id: string
  orderCount: number
}

export const useOrderCountMutation = () => {
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
