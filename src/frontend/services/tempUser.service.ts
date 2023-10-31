import { http } from '../http-common'
import { User } from '../../common/types/User'

const getOne = async (email: string) => {
  const res = await http.get<User>(`/api/tempUsers/${email}`)
  return res.data
}

export const FrontendTempUserService = {
  getOne,
}
