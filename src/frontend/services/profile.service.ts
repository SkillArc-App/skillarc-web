import { EducationExperience } from '@/common/types/EducationExperience'
import { Reference, Skill } from '@/common/types/Profile'
import { SeekerTrainingProvider } from '@/common/types/SeekerTrainingProvider'
import { TrainingProvider } from '@/common/types/TrainingProvider'
import axios from 'axios'
import { Story } from '../../app/profiles/[profileId]/edit/hooks/useUpdateProfile'
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

export type GetOneProfileResponse = {
  industryInterests: string[]
  isProfileEditor: boolean
  user: User & {
    SeekerTrainingProvider: (SeekerTrainingProvider & { trainingProvider: TrainingProvider })[]
  }
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

const addStory = async (profileId: string, story: Partial<Story>, token: string) => {
  const res = await axios.create({ withCredentials: false }).post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/stories`,
    { story },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return res.data
}

const updateStory = async (story: Partial<Story>, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${story.profile_id}/stories/${story.id}`,
      story,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const deleteStory = async (story: { profile_id: string; id: string }, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${story.profile_id}/stories/${story.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  return res.data
}

const deleteSkill = async (skill: Skill) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete<Skill>(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${skill.profileId}/skills/${skill.id}`,
    )
  return res.data
}

const addSkill = async (profileId: string, skill: Partial<Skill>, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .post<Skill>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

export const FrontendProfileService = {
  addStory,
  updateStory,
  deleteStory,
  deleteSkill,
  addSkill,
}
