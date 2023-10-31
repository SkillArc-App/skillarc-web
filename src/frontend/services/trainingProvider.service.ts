import axios from 'axios'

type TrainingProvider = {
  id: string
  name: string
  program: { name: string }[]
}

const getOne = async (id: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<TrainingProvider>(`${process.env.NEXT_PUBLIC_API_URL}/training_providers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendTrainingProviderService = {
  getOne,
}
