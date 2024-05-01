import { get } from '../http-common'

type TrainingProviderInvite = {
  email: string
  link: string
  usedAt: string
}
const getAll = async (token: string) => {
  const res = await get<TrainingProviderInvite[]>(`/training_provider_invites`, token)

  return res.data
}

export const FrontendTrainingProviderInviteService = {
  getAll,
}
