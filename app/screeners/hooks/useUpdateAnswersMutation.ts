import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { put } from '@/http-common'
import { AnswersRequest } from '@/screeners/types'
import { useQueryClient } from '@tanstack/react-query'

export const useUpdateAnswersMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ id, ...answers }: AnswersRequest, token: string) => {
      const result = await put(`screeners/answers/${id}`, answers, token)

      return result.data
    },
    {
      onSuccess: (_, answers) => {
        queryClient.invalidateQueries(['answers', answers.personId])
        onSuccess()
      },
    },
  )
}
