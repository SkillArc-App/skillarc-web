import { useAuthenticatedMutation } from '@/hooks/useAuthenticatedMutation'
import { post } from '@/http-common'
import { useQueryClient } from '@tanstack/react-query'
import { ContactDirection, ContactType } from '../types'

type ContactParams = {
  id: string
  note: string
  contactDirection: ContactDirection
  contactType: ContactType
}

export const useContactMutation = () => {
  const queryClient = useQueryClient()

  return useAuthenticatedMutation(
    async ({ id, ...body }: ContactParams, token: string) => {
      const result = await post(
        `coaches/contexts/${id}/contacts`,
        body,
        token,
      )

      return result.data
    },
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['coachSeeker', id])
      },
    },
  )
}
