import axios from 'axios'
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
  const res = await axios
    .create({ withCredentials: false })
    .get(`${process.env.NEXT_PUBLIC_API_URL}/training_providers/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}
