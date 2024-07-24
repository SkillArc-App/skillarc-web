import { useAuthenticatedMutation } from '@/app/hooks/useAuthenticatedMutation'
import { post } from '@/frontend/http-common'
import { useToast } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'

export const useOrderActivationMutation = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useAuthenticatedMutation(
    async (id: string, token: string) => {
      const result = await post(`job_orders/orders/${id}/activate`, {}, token)

      return result.data
    },
    {
      onSuccess: (_, id) => {
        queryClient.invalidateQueries(['jobOrder', id])
        queryClient.invalidateQueries(['jobOrders'])
      },
      onError: () => {
        toast({
          title: 'Unable to Activate Job Order Check for Existing Active Orders',
          status: 'error',
          position: 'top',
          duration: 3000,
          isClosable: true,
        })
      },
    },
  )
}
