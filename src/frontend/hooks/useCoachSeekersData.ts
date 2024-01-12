import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export interface SeekerNote {
  note: string
  date: string
  noteId: string
}

export interface CoachSeeker {
  seekerId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  barriers: string[]
  assignedCoach: string
  lastContacted: string
  lastActiveOn: string
  skillLevel: string
  stage: string
  notes: SeekerNote[]
}

export const useCoachSeekersData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getCoachSeekers = useQuery(['coachSeekers', token], () => {
    if (!token) return Promise.reject('No user id')

    const getCoachSeekersRequest = async () => {
      const res = await get<CoachSeeker[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/`,
        token,
      )

      return res.data
    }

    return getCoachSeekersRequest()
  })

  return getCoachSeekers
}
