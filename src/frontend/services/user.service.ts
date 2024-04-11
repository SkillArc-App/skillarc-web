import { TrainingProviderProfile } from '@/common/types/TrainingProviderProfile'
import { http } from '../http-common'
import { Profile } from './profile.service'

export type OnboardingSession = {
  completedAt: string | null
}

export type Recruiter = {
  id: string
}

export type Role = {
  name: 'admin' | 'coach' | 'employer_admin'
}

export type User = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  zipCode: string | null
  phoneNumber: string | null
}

export type FullUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  profile: Profile & {
    missingProfileItems: ('education' | 'work')[]
  }
  notifications: {
    id: string
    notificationTitle: string
    notificationBody: string
    read: boolean
    url: string
  }[]
  trainingProviderProfile: TrainingProviderProfile
  recruiter: Recruiter
  onboardingSession: OnboardingSession
  userRoles: { role: Role }[]
}

const update = async (user: Partial<User>) => {
  const res = await http.put<FullUser>(`/api/users/${user.id}`, user)
  return res.data
}

export const FrontendUserService = {
  update,
}
