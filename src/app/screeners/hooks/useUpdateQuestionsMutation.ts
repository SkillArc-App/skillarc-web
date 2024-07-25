import { useAuthenticatedMutation } from '@/app/hooks/useAuthenticatedMutation'
import { put } from '@/app/http-common'
import { Questions } from '@/app/screeners/types'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateQuestionsMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (questions: Questions, token: string) => {
      const result = await put(`screeners/questions/${questions.id}`, questions, token)

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
