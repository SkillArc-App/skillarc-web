import { useAuthenticatedQuery, useAuthenticatedQueryOptions } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Resume } from '../types'

export const useResumesQuery = (personId?: string, options: useAuthenticatedQueryOptions<Resume[]> = {}) =>
  useAuthenticatedQuery(
    ['resumes', personId],
    ({ token }) => {
      const getResumes = async () => {
        const res = await get<Resume[]>(`/documents/resumes`, token, { personId })

        return res.data
      }

      return getResumes()
    },
    { enabled: !!personId, ...options },
  )
