import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendEmployerService } from '../services/employer.service'

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
