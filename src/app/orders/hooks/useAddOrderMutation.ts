import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { post } from '@/frontend/http-common'
import { useQueryClient } from 'react-query'

export const useAddOrderMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ jobId }: { jobId: string }, token: string) => {
      const result = await post(`job_orders/orders`, { jobId }, token)

      return result.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['jobOrders'])
        onSuccess()
      },
    },
  )
}
