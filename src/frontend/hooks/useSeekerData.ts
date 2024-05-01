import { get } from '@/frontend/http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export type AdminSeeker = {
  id: string
  firstName: string
  lastName: string
  email?: string
  trainingProvider: AdminSeekerTrainingProvider[]
}

export type AdminSeekerTrainingProvider = {
  id: string
  name: string
}

export const useSeekerData = () => {
  const getSeekers = useAuthenticatedQuery(['seekers'], async ({ token }) => {
    const res = await get<AdminSeeker[]>(`/profiles`, token)

    return res.data
  })

  return getSeekers
}
