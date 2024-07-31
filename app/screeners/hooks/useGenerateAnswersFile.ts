import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'

export const useGenerateAnswersFile = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(async (id: string, token: string) => {
    const result = await post(`screeners/answers/${id}/generate_file`, {}, token)

    return result.data
  })
}
