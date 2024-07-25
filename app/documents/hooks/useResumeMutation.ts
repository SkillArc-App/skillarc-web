import { useQueryClient } from '@tanstack/react-query'
import { useAuthenticatedMutation } from 'app/hooks/useAuthenticatedMutation'
import { post } from 'app/http-common'
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
