import { get } from '../http-common'
import { FrontendTrainingProviderService } from '../services/trainingProvider.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllTrainingProviderData = () => {
  const getAllTrainingProviders = useAuthenticatedQuery(['trainingProviders'], ({ token }) => {
    return getAll(token)
  })

  return { getAllTrainingProviders }
}

export const useTrainingProviderData = (id: string) => {
  const getTrainingProvider = useAuthenticatedQuery(['trainingProvider'], ({ token }) => {
    return FrontendTrainingProviderService.getOne(id, token)
  })

  return { getTrainingProvider }
}

const getAll = async (token: string) => {
  const res = await get(`/training_providers/`, token)

  return res.data
}
