import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { CoachSeeker } from './useCoachSeekersData'

export const useCoachSeekerData = (id: string) => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getCoachSeeker = useQuery(['coachSeeker', id, token], () => {
    if (!token) return Promise.reject('No user id')

    const getCoachSeekerRequest = async () => {
      const res = await get<CoachSeeker>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/${id}`,
        token,
      )

      return res.data
    }

    return getCoachSeekerRequest()
  })

  return getCoachSeeker
}
