import { get } from "@/frontend/http-common"
import { Resume } from "../types"
import { useAuthenticatedQuery } from "@/frontend/hooks/useAuthenticatedQuery"

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
    { enabled: !!personId }, // , refetchInterval: 2000
  )