import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { put } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'

type OrderParams = {
  id: string
  screenerQuestionsId: string
}

export const useOrderAddScreenerMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ id, screenerQuestionsId }: OrderParams, token: string) => {
      const result = await put(
        `job_orders/orders/${id}`,
        {
          screenerQuestionsId,
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
