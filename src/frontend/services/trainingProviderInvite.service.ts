import axios from 'axios'

type TrainingProviderInvite = {
  email: string
  link: string
  usedAt: string
}
const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<TrainingProviderInvite[]>(`${process.env.NEXT_PUBLIC_API_URL}/training_provider_invites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

  return res.data
}

export const FrontendTrainingProviderInviteService = {
  getAll,
}
