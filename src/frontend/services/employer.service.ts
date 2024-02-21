import axios from 'axios'

export type Employer = {
  id: string
  name: string
  location: string | null
  bio: string
  logoUrl: string | null
  createdAt: Date
  updatedAt: Date
}

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<Employer[]>(`${process.env.NEXT_PUBLIC_API_URL}/employers`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const get = async (id: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<Employer>(`${process.env.NEXT_PUBLIC_API_URL}/employers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendEmployerService = {
  get,
  getAll,
}
