import { get } from '../http-common'
import { FullUser } from '../services/user.service'
import { mixpanelInitUser } from '../utils/mixpanel'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUser = () => {
  const userQuery = useAuthenticatedQuery(['me'], ({ token }) => {
    const getOne = async () => {
      const res = await get<FullUser>(`/one_user/`, token)
      mixpanelInitUser(res.data)
      return res.data
    }
    return getOne()
  })

  return userQuery
}
