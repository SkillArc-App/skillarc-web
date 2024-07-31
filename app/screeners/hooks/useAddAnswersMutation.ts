import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { AnswersRequest } from '@/screeners/types'
import { useQueryClient } from '@tanstack/react-query'

export const useAddAnswersMutation = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ id, ...answers }: AnswersRequest, token: string) => {
      const result = await post(`screeners/answers/`, answers, token)

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
