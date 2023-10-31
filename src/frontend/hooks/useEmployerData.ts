import { useQuery } from 'react-query'
import { FrontendEmployerService } from '../services/employer.service'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export const useEmployerData = (id: string) => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getEmployer = useQuery(['employer', id, token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.get(id, token)
  })

  return { getEmployer }
}
