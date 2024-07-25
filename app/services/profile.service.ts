import { EducationExperience } from '@/common/types/EducationExperience'
import { Reference, Skill } from '@/common/types/Profile'
import { TrainingProvider } from '@/common/types/TrainingProvider'
import { PartialRequired } from '@/common/types/partial-required'
import { destroy, post, put } from '../http-common'
import { OtherExperience } from './otherExperiences.service'
import { PersonalExperience } from './personalExperience.service'
import { ProfileSkill } from './profileSkills.service'
import { MasterSkill } from './skills.service'
import { User } from './user.service'

export type Profile = {
  id: string
  about?: string
  userId: string
}

export type Story = {
  id: string
  profileId: string
  prompt: string
  response: string
}

export type GetOneProfileResponse = {
  isProfileEditor: boolean
  user: User
  stories: Story[]
  otherExperiences: OtherExperience[]
  personalExperience: PersonalExperience[]
  educationExperiences: EducationExperience[]
  profileSkills: (ProfileSkill & { masterSkill: MasterSkill })[]
  missingProfileItems: ('education' | 'work')[]
  hiringStatus: string
  reference: (Reference & {
    authorUser: User
    trainingProvider: TrainingProvider
  })[]
} & Profile

const addStory = async (story: PartialRequired<Story, 'profileId'>, token: string) => {
  await post(`/profiles/${story.profileId}/stories`, { story }, token)
}

const updateStory = async (story: Partial<Story>, token: string) => {
  await put(`/profiles/${story.profileId}/stories/${story.id}`, story, token)
}

const deleteStory = async (story: { profileId: string; id: string }, token: string) => {
  const res = await destroy(`/profiles/${story.profileId}/stories/${story.id}`, token)
}

const addSkill = async (skill: PartialRequired<Skill, 'profileId'>, token: string) => {
  const res = post<Skill>(`/profiles/${skill.profileId}/skills`, skill, token)
}

export const FrontendProfileService = {
  addStory,
  updateStory,
  deleteStory,
  addSkill,
}
