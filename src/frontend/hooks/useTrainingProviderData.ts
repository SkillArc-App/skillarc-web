import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendTrainingProviderService } from '../services/trainingProvider.service'

export const useAllTrainingProviderData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getAllTrainingProviders = useQuery(['trainingProviders', token], () => {
    if (!token) {
      return Promise.reject('No user id')
    }
    return getAll(token)
  })

  return { getAllTrainingProviders }
}

export const useTrainingProviderData = (id: string) => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getTrainingProvider = useQuery(['trainingProvider', token], () => {
    if (!token) {
      return Promise.reject('No user id')
    }

    return FrontendTrainingProviderService.getOne(id, token)
  })

  return { getTrainingProvider }
}

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get(`${process.env.NEXT_PUBLIC_API_URL}/training_providers/`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}
