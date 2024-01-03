import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendReferenceService } from '../services/reference.service'

export const useReferenceData = (referenceId: string) => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getReference = useQuery(['profile', referenceId, token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendReferenceService.getOne(referenceId, token)
  })

  return { getReference }
}
