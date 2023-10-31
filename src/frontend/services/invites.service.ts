import axios from 'axios'

type Invite = {
  seekerType: 'TRAINING_PROVIDER' | 'SEEKER'
  email: string
  link: string
  usedAt: string
}
const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<Invite[]>(`${process.env.NEXT_PUBLIC_API_URL}/seeker_invites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

  return res.data
}

export const FrontendInviteService = {
  getAll,
}
