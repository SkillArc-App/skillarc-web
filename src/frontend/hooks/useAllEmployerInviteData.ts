import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendEmployerInviteService } from '../services/employerInvite.service'

export const useAllEmployerInviteData = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getEmployerInvites = useQuery(['employerInvites', token], () => {
    if (!token) return Promise.resolve([])

    return FrontendEmployerInviteService.getAll(token)
  })

  return { getEmployerInvites }
}
