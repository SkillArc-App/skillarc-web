import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Resume } from '../types'

export const useResumesQuery = (personId?: string) =>
  useAuthenticatedQuery(
    ['resumes', personId],
    ({ token }) => {
      const getResumes = async () => {
        const res = await get<Resume[]>(`/documents/resumes`, token, { personId })

        return res.data
      }

      return getResumes()
    },
    { enabled: !!personId, refetchInterval: 2000 },
  )
