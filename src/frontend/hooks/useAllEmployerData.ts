import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendEmployerService } from '../services/employer.service'

export const useAllEmployerData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getEmployers = useQuery(['employers', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendEmployerService.getAll(token)
  })

  return { getEmployers }
}
