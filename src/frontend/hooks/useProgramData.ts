import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendProgramService } from '../services/program.service'

export const useAllProgramData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getAllPrograms = useQuery(['programs', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendProgramService.getAll(token)
  })

  return { getAllPrograms }
}

export const useProgramDataForTrainingProvider = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getPrograms = useQuery(['tpPrograms', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendProgramService.getAllForTrainingProvder(token)
  })

  return { getPrograms }
}

export const useProgramData = (id: string) => {
  const getProgram = useQuery('program', () => FrontendProgramService.getOne(id))

  return { getProgram }
}
