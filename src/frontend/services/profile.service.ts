import { DesiredOutcome } from '@/common/types/DesiredOutcome'
import { EducationExperience } from '@/common/types/EducationExperience'
import { ProfessionalInterest } from '@/common/types/ProfessionalInterest'
import { Reference, Skill } from '@/common/types/Profile'
import { SeekerTrainingProvider } from '@/common/types/SeekerTrainingProvider'
import { TrainingProvider } from '@/common/types/TrainingProvider'
import { TrainingProviderProfile } from '@/common/types/TrainingProviderProfile'
import axios from 'axios'
import { Story } from '../../app/profiles/[profileId]/edit/hooks/useUpdateProfile'
import { MasterCertification } from './certification.service'
import { OtherExperience } from './otherExperiences.service'
import { PersonalExperience } from './personalExperience.service'
import { ProfileCertification } from './profileCertifications.service'
import { ProfileSkill } from './profileSkills.service'
import { MasterSkill } from './skills.service'
import { User } from './user.service'

export type Profile = {
  id: string
  userId: string
  bio: string | null
  image: string | null
  status: string | null
}

export type GetOneProfileResponse = {
  industryInterests: string[]
  isProfileEditor: boolean
  metCareerCoach: boolean
  user: User & {
    SeekerTrainingProvider: (SeekerTrainingProvider & { trainingProvider: TrainingProvider })[]
  }
  stories: Story[]
  skills: Skill[]
  otherExperiences: OtherExperience[]
  personalExperience: PersonalExperience[]
  educationExperiences: EducationExperience[]
  profileSkills: (ProfileSkill & { masterSkill: MasterSkill })[]
  profileCertifications: (ProfileCertification & { masterCertification: MasterCertification })[]
  desiredOutcomes: DesiredOutcome[]
  missingProfileItems: ('education' | 'work')[]
  professionalInterests: ProfessionalInterest[]
  programs: {
    trainingProvider: {
      name: string
    }
    name: string
    programSkill: {
      skill: {
        skill: string
        type: 'PERSONAL' | 'TECHNICAL'
      }
    }[]
  }[]
  hiringStatus: string
  reference: (Reference & {
    authorProfile: TrainingProviderProfile & { user: User }
    trainingProvider: TrainingProvider
  })[]
} & Profile

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneProfileResponse[]>(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

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
  getAll,
  addStory,
  updateStory,
  deleteStory,
  deleteSkill,
  addSkill,
}
