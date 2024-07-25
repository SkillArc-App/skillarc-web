import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { Questions } from '@/screeners/types'
import { useQueryClient } from '@tanstack/react-query'

export const useAddQuestionsMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (questions: Questions, token: string) => {
      const result = await post(`screeners/questions/`, questions, token)

      return result.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['questions'])
        onSuccess()
      },
    },
  )
}
