import {
  DesiredOutcomes,
  EducationExperience,
  MasterCertification,
  MasterSkill,
  OnboardingSession,
  OtherExperience,
  PersonalExperience,
  ProfessionalInterests,
  Profile,
  ProfileCertification,
  ProfileSkill,
  Recruiter,
  Role,
  Story,
  TrainingProviderProfile,
  User,
  UserRoles,
} from '@prisma/client'
import { http } from '../http-common'
import { mixpanelInitUser } from '../utils/mixpanel'

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
