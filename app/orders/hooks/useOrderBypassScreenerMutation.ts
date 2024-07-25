import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'

export const useOrderBypassScreenerMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (id: string, token: string) => {
      const result = await post(`job_orders/orders/${id}/bypass_screener_questions`, {}, token)

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
