import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { destroy, post, put } from '@/frontend/http-common'
import { useQueryClient } from 'react-query'

export const useNotes = () => {
  const queryClient = useQueryClient()

  const onSuccess = (_: any, { jobId }: { jobId: string }) => {
    queryClient.invalidateQueries(['jobOrder', jobId])
  }

  const addNote = useAuthenticatedMutation(
    async ({ jobId, note }: { jobId: string; note: string }, token: string) => {
      const result = await post(`job_orders/orders/${jobId}/notes`, { note }, token)

      return result.data
    },
    { onSuccess },
  )
  const modifyNote = useAuthenticatedMutation(
    async (
      { jobId, noteId, note }: { jobId: string; noteId: string; note: string },
      token: string,
    ) => {
      const result = await put(`job_orders/orders/${jobId}/notes/${noteId}`, { note }, token)

      return result.data
    },
    { onSuccess },
  )
  const removeNote = useAuthenticatedMutation(
    async ({ jobId, noteId }: { jobId: string; noteId: string }, token: string) => {
      const result = await destroy(`job_orders/orders/${jobId}/notes/${noteId}`, token)

      return result.data
    },
    { onSuccess },
  )

  return { addNote, modifyNote, removeNote }
}
