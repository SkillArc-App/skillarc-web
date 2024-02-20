import { destroy, post, put } from '../http-common'

export type PersonalExperience = {
  id: string
  activity: string | null
  startDate: string | null
  endDate: string | null
  description: string | null
}

const create = async (
  personalExperience: Partial<PersonalExperience>,
  profileId: string,
  token: string,
) => {
  const res = await post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences`,
    personalExperience,
    token,
  )
  return res.data
}

const update = async (
  personalExperience: Partial<PersonalExperience>,
  profileId: string,
  token: string,
) => {
  const res = await put(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperience.id}`,
    personalExperience,
    token,
  )
  return res.data
}

const deleteOne = async (personalExperienceId: string, profileId: string, token: string) => {
  const res = await destroy(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperienceId}`,
    token,
  )
  return res.data
}

export const FrontendPersonalExperiencesService = {
  update,
  create,
  deleteOne,
}
