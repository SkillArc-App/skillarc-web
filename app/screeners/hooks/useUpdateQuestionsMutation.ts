import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { put } from '@/http-common'
import { QuestionsRequest } from '@/screeners/types'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateQuestionsMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (questions: QuestionsRequest, token: string) => {
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
