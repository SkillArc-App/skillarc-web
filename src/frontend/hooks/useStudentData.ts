import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendStudentService } from '../services/student.service'

export const useStudentData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getStudents = useQuery(['student', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendStudentService.getFor(token)
  })

  return { getStudents }
}
