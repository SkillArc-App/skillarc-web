import { get } from '../http-common'

type Program = {
  id: string
  name: string
  description: string
  trainingProvider: { name: string }
  trainingProviderId: string
}

const getAll = async (token: string) => {
  // const res = await http.get<Program[]>(`/api/programs`)
  const res = await get<Program[]>(`/programs`, token)
  return res.data
}

const getAllForTrainingProvder = async (token: string) => {
  const res = await get<Program[]>(`/training_providers/programs`, token)
  return res.data
}

const getOne = async (id: string) => {
  const res = await get<Program>(`/api/programs/${id}`)
  return res.data
}

export const FrontendProgramService = {
  getAll,
  getAllForTrainingProvder,
  getOne,
}
