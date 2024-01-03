import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendTrainingProviderInviteService } from '../services/trainingProviderInvite.service'

export const useAllTrainingProviderInviteData = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getAllTrainingProviderInvites = useQuery(['invite', token], () => {
    if (!token) return Promise.resolve([])

    return FrontendTrainingProviderInviteService.getAll(token)
  })

  return { getAllTrainingProviderInvites }
}
