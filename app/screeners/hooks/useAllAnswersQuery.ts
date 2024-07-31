import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Answers } from '../types'

export const useAllAnswersQuery = (personId?: string) =>
  useAuthenticatedQuery(
    ['answers', personId],
    ({ token }) => {
      const getResumes = async () => {
        const res = await get<Answers[]>(`/screeners/answers`, token, { personId })

        return res.data
      }

      return getResumes()
    },
    { enabled: !!personId, refetchInterval: 2000 },
  )
