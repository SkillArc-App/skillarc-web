import { TrainingProviderProfile } from '@/app/common/types/TrainingProviderProfile'
import { put } from '../http-common'
import { Profile } from './profile.service'

export type OnboardingSession = {
  completedAt: string | null
}

export type Recruiter = {
  id: string
}

export type Role = {
  name: 'admin' | 'coach' | 'employer_admin' | 'job_order_admin'
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
  notifications: Notification[]
  trainingProviderProfile: TrainingProviderProfile
  recruiter: Recruiter
  onboardingSession: OnboardingSession
  userRoles: { role: Role }[]
}

export type Notification = {
  id: string
  notificationTitle: string
  notificationBody: string
  read: boolean
  url: string
}

const update = async (user: Partial<User>, token: string) => {
  const res = await put<FullUser>(`/api/users/${user.id}`, user, token)
  return res.data
}

export const FrontendUserService = {
  update,
}
