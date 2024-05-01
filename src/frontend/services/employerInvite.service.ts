import { get } from '../http-common'

const getAll = async (token: string) => {
  const res = await get(`/employer_invites`, token)

  return res.data
}

export const FrontendEmployerInviteService = {
  getAll,
}
