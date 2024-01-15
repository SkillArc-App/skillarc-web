import axios from 'axios'
import { http } from '../http-common'
import { mixpanelInitProfile } from '../utils/mixpanel'
import { MasterCertification } from './certification.service'
import { OtherExperience } from './otherExperiences.service'
import { PersonalExperience } from './personalExperience.service'
import { ProfileCertification } from './profileCertifications.service'
import { ProfileSkill } from './profileSkills.service'
import { MasterSkill } from './skills.service'
import { User } from './user.service'

export type DesiredOutcomes = {
  id: string
  profile_id: string
  response: string
  created_at: Date
  updated_at: Date
}

export type EducationExperience = {
  id: string
  organization_id: string | null
  organization_name: string | null
  profile_id: string
  title: string | null
  activities: string | null
  graduation_date: string | null
  gpa: string | null
  created_at: Date
  updated_at: Date
}

export type Preference = {
  id: string
  email_consent: Date | null
  information_consent: Date | null
  profile_id: string
  created_at: Date
  updated_at: Date
}

export type ProfessionalInterests = {
  id: string
  profile_id: string
  response: string
  created_at: Date
  updated_at: Date
}

export type Profile = {
  id: string
  user_id: string
  bio: string | null
  image: string | null
  status: string | null
  created_at: Date
  updated_at: Date
}

export type Reference = {
  id: string
  author_profile_id: string
  reference_text: string
  seeker_profile_id: string
  training_provider_id: string
  created_at: Date
  updated_at: Date
}

export type SeekerTrainingProvider = {
  id: string
  program_id: string | null
  training_provider_id: string
  user_id: string
  created_at: Date
  updated_at: Date
}

export type Skills = {
  id: string
  name: string | null
  type: string | null
  profile_id: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type Story = {
  id: string
  profile_id: string
  prompt: string
  response: string
  created_at: Date
  updated_at: Date
}

export type TrainingProvider = {
  id: string
  name: string
  description: string
  created_at: Date
  updated_at: Date
}

export type TrainingProviderProfile = {
  id: string
  training_provider_id: string
  user_id: string
  created_at: Date
  updated_at: Date
}

export type GetOneProfileResponse = {
  industryInterests: string[]
  met_career_coach: boolean
  user: User & {
    SeekerTrainingProvider: (SeekerTrainingProvider & { trainingProvider: TrainingProvider })[]
  }
  stories: Story[]
  skills: Skills[]
  otherExperiences: OtherExperience[]
  personalExperience: PersonalExperience[]
  educationExperiences: EducationExperience[]
  profileSkills: (ProfileSkill & { masterSkill: MasterSkill })[]
  profileCertifications: (ProfileCertification & { masterCertification: MasterCertification })[]
  desiredOutcomes: DesiredOutcomes[]
  missingProfileItems: ('education' | 'work')[]
  professionalInterests: ProfessionalInterests[]
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

const getOne = async (profileId: string) => {
  const res = await http.get<GetOneProfileResponse>(`/api/profiles/${profileId}`)
  mixpanelInitProfile(res.data)
  return res.data
}

const getAll = async (token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .get<GetOneProfileResponse[]>(`${process.env.NEXT_PUBLIC_API_URL}/profiles`, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const onboardingUpsert = async (profile: Partial<Profile>, userId?: string) => {
  profile.user_id = userId
  if (!profile.id) {
    return await http.post<Profile>('/api/profiles', profile)
  } else {
    return await http.put<Profile>(`/api/profiles/${profile?.id}/onboarding`, profile)
  }
}

const addPreferences = async (preferences: Partial<Preference>, profileId?: string) => {
  const res = await http.post<Story>(`/api/profiles/${profileId}/preferences`, preferences)
  return res.data
}

const updatePreferences = async (preferences: any, profileId?: string) => {
  return await http.put<Profile>(`/api/profiles/${profileId}/preferences`, preferences)
}

const update = async (profile: Partial<Profile>) => {
  const res = await http.put<Profile>(`/api/profiles/${profile?.id}`, profile)
  return res.data
}

const addStory = async (profileId: string, story: Partial<Story>, token: string) => {
  // const res = await http.post<Story>(`/api/profiles/${profileId}/stories`, story)
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
  // const res = await http.put<Story>(`/api/profiles/${story.profile_id}/stories/${story.id}`, story)
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

const deleteSkill = async (skill: Skills) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete<Skills>(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${skill.profile_id}/skills/${skill.id}`,
    )
  return res.data
}

const addSkill = async (profileId: string, skill: Partial<Skills>, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .post<Skills>(`${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/skills`, skill, {
      headers: { Authorization: `Bearer ${token}` },
    })

  return res.data
}

const updateSkill = async (profileId: string, skill: Skills) => {
  const res = await http.put<Skills>(`/api/profiles/${profileId}/skills/${skill.id}`, skill)
  return res.data
}

export const FrontendProfileService = {
  getAll,
  getOne,
  onboardingUpsert,
  addPreferences,
  updatePreferences,
  update,
  addStory,
  updateStory,
  deleteStory,
  deleteSkill,
  addSkill,
  updateSkill,
}
