import { get } from '../../frontend/http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export type TrainingProvider = {
  id: string
  name: string
  description: string
  programs: Program[]
}

export type Program = {
  id: string
  name: string
  description: string
}

export const useAllTrainingProviderData = () =>
  useAuthenticatedQuery(['trainingProviders'], async ({ token }) => {
    const res = await get<TrainingProvider[]>(`/training_providers/`, token)

    return res.data
  })

export const useTrainingProviderData = (id: string) =>
  useAuthenticatedQuery(['trainingProvider'], async ({ token }) => {
    const res = await get<TrainingProvider>(`/training_providers/${id}`, token)

    return res.data
  })
