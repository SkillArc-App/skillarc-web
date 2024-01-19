import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export interface SeekerNote {
  note: string
  noteTakenBy: string
  date: string
  noteId: string
}

export interface SeekerApplication {
  status: string
  employerName: string
  jobId: string
  employmentTitle: string
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
  applications: SeekerApplication[]
}

export const useCoachSeekersData = () =>
  useAuthenticatedQuery(['coachSeekers'], ({ token }) => {
    const getCoachSeekersRequest = async () => {
      const res = await get<CoachSeeker[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/coaches/seekers/`,
        token,
      )

      return res.data
    }

    return getCoachSeekersRequest()
  })
