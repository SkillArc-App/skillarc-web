import { get } from '../http-common'

type Invite = {
  seekerType: 'TRAINING_PROVIDER' | 'SEEKER'
  email: string
  link: string
  usedAt: string
}
const getAll = async (token: string) => {
  const res = await get<Invite[]>(`/seeker_invites`, token)

  return res.data
}

export const FrontendInviteService = {
  getAll,
}
