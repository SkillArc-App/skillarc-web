import axios from 'axios'
import { FullUser } from '../services/user.service'
import { mixpanelInitUser } from '../utils/mixpanel'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUser = () => {
  const userQuery = useAuthenticatedQuery(['me'], ({ token }) => {
    const getOne = async () => {
      const res = await axios
        .create({ withCredentials: false })
        .get<FullUser>(`${process.env.NEXT_PUBLIC_API_URL}/one_user/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      mixpanelInitUser(res.data)
      return res.data
    }
    return getOne()
  })

  return userQuery
}
