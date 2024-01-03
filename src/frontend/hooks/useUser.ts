import axios from 'axios'
import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FullUser } from '../services/user.service'
import { mixpanelInitUser } from '../utils/mixpanel'

export const useUser = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

  const userQuery = useQuery(
    ['me', token],
    () => {
      if (!token) {
        return Promise.reject('No user id')
      }
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
    },
    {
      enabled: !!token,
    },
  )

  return userQuery
}
