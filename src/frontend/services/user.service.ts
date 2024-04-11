import { TrainingProviderProfile } from '@/common/types/TrainingProviderProfile'
import { http } from '../http-common'
import { mixpanelInitUser } from '../utils/mixpanel'
import { Profile } from './profile.service'

export type OnboardingSession = {
  completed_at: string | null
}

export type Recruiter = {
  id: string
}

export type Role = {
  id: string
  name: 'admin' | 'coach' | 'recruiter' | 'seeker' | 'training_provider'
}

export type User = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  zipCode: string | null
  phoneNumber: string | null
}

export type UserRoles = {
  id: string
  user_id: string
  role_id: string
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
  userRoles: (UserRoles & { role: Role })[]
}

const getOne = async (userId: string) => {
  const res = await http.get<FullUser>(`/api/users/${userId}`)
  mixpanelInitUser(res.data)
  return res.data
}

const update = async (user: Partial<User>) => {
  const res = await http.put<FullUser>(`/api/users/${user.id}`, user)
  return res.data
}

const updateUserWithTempData = async (user: Partial<User>, id: string) => {
  const res = await http.put<FullUser>(`/api/users/tempData/${id}`, user)
  return res.data
}

export const FrontendUserService = {
  getOne,
  update,
  updateUserWithTempData,
}
