import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'
import { ResumeRequest } from '../types'

export const useResumeMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async (request: ResumeRequest, token: string) => {
      const result = await post(
        `/documents/resumes`,
        {
          ...request,
        },
        token,
      )

      return result.data
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(['resumes', variables.personId])
      },
    },
  )
}
