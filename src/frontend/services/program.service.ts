import axios from 'axios'
import { http } from '../http-common'

type Program = {
  id: string
  name: string
  description: string
  trainingProvider: { name: string }
  trainingProviderId: string
}

const getAll = async (token: string) => {
  // const res = await http.get<Program[]>(`/api/programs`)
  const res = await axios
    .create({ withCredentials: false })
    .get<Program[]>(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  return res.data
}

const getAllForTrainingProvder = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<Program[]>(`${process.env.NEXT_PUBLIC_API_URL}/training_providers/programs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  return res.data
}

const getOne = async (id: string) => {
  const res = await http.get<Program>(`/api/programs/${id}`)
  return res.data
}

export const FrontendProgramService = {
  getAll,
  getAllForTrainingProvder,
  getOne,
}
