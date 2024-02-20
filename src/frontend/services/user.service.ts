import { EducationExperience } from '@/common/types/EducationExperience'
import { PersonalExperience } from '@/common/types/PersonalExperience'
import { DesiredOutcomes, ProfessionalInterests, Story } from '@/common/types/Profile'
import { TrainingProviderProfile } from '@/common/types/TrainingProviderProfile'
import { http } from '../http-common'
import { mixpanelInitUser } from '../utils/mixpanel'
import { MasterCertification } from './certification.service'
import { OtherExperience } from './otherExperiences.service'
import { Profile } from './profile.service'
import { ProfileCertification } from './profileCertifications.service'
import { ProfileSkill } from './profileSkills.service'
import { MasterSkill } from './skills.service'

export type OnboardingSession = {
  id: string
  user_id: string
  started_at: Date
  completed_at: Date | null
  current_step: string | null
  responses: any
  created_at: Date
  updated_at: Date
}

export type Recruiter = {
  id: string
  user_id: string
  employer_id: string
  created_at: Date
  updated_at: Date
}

export type Role = {
  id: string
  name: 'admin' | 'coach' | 'recruiter' | 'seeker' | 'training_provider'
  created_at: Date
  updated_at: Date
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
  created_at: Date
  updated_at: Date
}

export type FullUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  fastTrackTasks: {
    profile: { name: string; is_complete: boolean; route: string }[]
    career: { name: string; is_complete: boolean; route: string }[]
  }
  phoneNumber: string
  zipCode: string
  profile: Profile & {
    desiredOutcomes: DesiredOutcomes[]
    professionalInterests: ProfessionalInterests[]
    profileCertifications: (ProfileCertification & { masterCertification: MasterCertification })[]
    profileSkills: (ProfileSkill & { masterSkill: MasterSkill })[]
    stories: Story[]
    educationExperiences: EducationExperience[]
    otherExperiences: OtherExperience[]
    personalExperience: PersonalExperience[]
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
  recruiter: Recruiter[]
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
