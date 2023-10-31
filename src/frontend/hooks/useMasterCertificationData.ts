import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendMasterCertificationService } from '../services/certification.service'

export const useMasterCertificationData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const masterCertificationQuery = useQuery(['masterCertification', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendMasterCertificationService.getAll(token)
  })

  return { masterCertificationQuery }
}
