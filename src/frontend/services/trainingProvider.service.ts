import { get } from '../http-common'

type TrainingProvider = {
  id: string
  name: string
  program: { name: string }[]
}

const getOne = async (id: string, token: string) => {
  const res = await get<TrainingProvider>(`/training_providers/${id}`, token)

  return res.data
}

export const FrontendTrainingProviderService = {
  getOne,
}
