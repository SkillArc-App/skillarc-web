import { get } from '../http-common'

type Program = {
  id: string
  name: string
  description: string
  trainingProvider: { name: string }
  trainingProviderId: string
}

const getOne = async (id: string) => {
  const res = await get<Program>(`/api/programs/${id}`)
  return res.data
}

export const FrontendProgramService = {
  getOne,
}
