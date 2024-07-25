import { useAuthenticatedQuery } from '@/app/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'

export type Program = {
  name: string
  description: string
  trainingProviderName: string
  trainingProviderId: string
}

export const useProgramData = (id: string) =>
  useAuthenticatedQuery(
    ['program', id],
    async ({ token }) => {
      const res = await get<Program>(`/programs/${id}`, token)
      return res.data
    },
    { enabled: !!id },
  )
