import { OtherExperience } from '@/frontend/services/otherExperiences.service'
import { EducationExperience } from './EducationExperience'
import { Profile } from './Profile'
import { TrainingProviderProfile } from './TrainingProviderProfile'

export type User = {
  id: string
  name?: string
  email?: string
  image?: string
  firstName?: string
  lastName?: string
  zipCode?: string
  profile?: Profile
  SeekerTrainingProvider?: {
    programId: string
    trainingProviderId: string
  }[]
  trainingProviderProfile?: TrainingProviderProfile
  recruiter?: {
    id: string
    employerId: string
  }[]
  phoneNumber?: string
  userRoles?: {
    role: { name: string }
  }[]
  onboardingSession?: OnboardingSession
  otherExperience?: OtherExperience[]
  educationExperience?: EducationExperience[]
  // accounts      Account[]
  // sessions      Session[]
  // emailVerified: DateTime
}

export type OnboardingSession = {
  id: string
  userId?: string
  startedAt?: string
  completedAt?: string
  currentStep?: string
}
