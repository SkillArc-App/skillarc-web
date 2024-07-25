import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useToast } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'

export const useAddOrderMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()
  const toast = useToast()

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
      onError: () => {
        toast({
          title: 'Unable to Add Job Order Check for Existing Orders',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      },
    },
  )
}
