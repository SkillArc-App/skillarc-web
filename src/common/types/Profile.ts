import { OtherExperience } from '@/frontend/services/otherExperiences.service'
import { EducationExperience } from './EducationExperience'
import { PersonalExperience } from './PersonalExperience'

// export type GetOneProfileResponse = {
//   user: User
//   stories: PrismaStory[]
//   skills: Skills[]
//   otherExperiences: OtherExperience[]
//   educationExperiences: EducationExperience[]
//   profileSkills: ProfileSkill[]
//   desiredOutcomes: DesiredOutcomes[]
//   professionalInterests: ProfessionalInterests[]
// } & PrismaProfile

export type Profile = {
  id: string
  userId?: string
  bio?: string
  image?: string
  status?: string
  // user: User
  // credentials           Credential[]
  otherExperiences?: OtherExperience[]
  personalExperience?: PersonalExperience[]
  educationExperiences?: EducationExperience[]
  preferences?: Preference
  professionalInterests?: ProfessionalInterests[]
  desiredOutcomes?: DesiredOutcomes[]
  // skills?: Skill[]
  stories?: Story[]
  profileSkills?: ProfileSkill[]
  profileCertifications?: ProfileCertification[]
}

export type ProfessionalInterests = {
  id: string
  profileId: string
  response: string
}

export type Preference = {
  id: string
  emailConsent: Date | null
  informationConsent: Date | null
  profileId: string
}

export type ProfileSkill = {
  id: string
  profileId: string
  masterSkillId: string
  description: string
  masterSkill: {
    id: string
    skill: string
    type: 'PERSONAL' | 'TECHNICAL'
  }
}

export type ProfileCertification = {
  id: string
  profileId: string
  masterCertificationId: string
  masterCertification: {
    id: string
    certification: string
  }
}

export type MasterSkill = {
  id: string
  skill: string
  type: 'PERSONAL' | 'TECHNICAL'
}

export type MasterCertification = {
  id: string
  certification: string
}

export type Reference = {
  id: string
  seekerProfileId: string
  referenceText: string
}

export type Story = {
  id: string
  profileId?: string
  prompt?: string
  response?: string
}

export type Skill = {
  id: string
  profileId?: string
  name?: string
  type?: string
  description?: string
}

export type DesiredOutcomes = {
  id: string
  profileId?: string
  response?: string
}

export type ProfesstionalInterests = {
  id: string
  profileId?: string
  response?: string
}
