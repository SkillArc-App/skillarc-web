import { get } from '../http-common'

export type Employer = {
  id: string
  name: string
  location: string | null
  bio: string
  logoUrl: string | null
  createdAt: string
}

const getAll = async (token: string) => {
  const res = await get<Employer[]>(`/employers`, token)

  return res.data
}

const getOne = async (id: string, token: string) => {
  const res = await get<Employer>(`/employers/${id}`, token)

  return res.data
}

export const FrontendEmployerService = {
  get: getOne,
  getAll,
}
