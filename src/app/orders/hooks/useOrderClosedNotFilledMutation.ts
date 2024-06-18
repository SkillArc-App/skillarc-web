import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { post } from '@/frontend/http-common'
import { useQueryClient } from '@tanstack/react-query'

export const useOrderClosedMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (id: string, token: string) => {
      const result = await post(`job_orders/orders/${id}/close_not_filled`, {}, token)

      return result.data
    },
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['jobOrder', id])
        queryClient.invalidateQueries(['jobOrders'])
      },
    },
  )
}
