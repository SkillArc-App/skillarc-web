import axios from 'axios'
import { http } from '../http-common'
import { mixpanelInitProfile } from '../utils/mixpanel'
import {
  DesiredOutcomes,
  EducationExperience,
  MasterCertification,
  MasterSkill,
  OtherExperience,
  PersonalExperience,
  Preference,
  ProfessionalInterests,
  Profile,
  ProfileCertification,
  ProfileSkill,
  Reference,
  SeekerTrainingProvider,
  Skills,
  Story,
  TrainingProvider,
  TrainingProviderProfile,
  User,
} from '@prisma/client'

export type GetOneProfileResponse = {
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
