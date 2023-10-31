import axios from 'axios'

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get(`${process.env.NEXT_PUBLIC_API_URL}/employer_invites`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendEmployerInviteService = {
  getAll,
}
