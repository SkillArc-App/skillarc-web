import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendInviteService } from '../services/invites.service'

export const useAllSeekerInviteData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getAllInvites = useQuery(['invite', token], () => {
    if (!token) {
      return Promise.reject('No user id')
    }

    return FrontendInviteService.getAll(token)
  })

  return { getAllInvites }
}
