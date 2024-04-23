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
  await post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences`,
    personalExperience,
    token,
  )
}

const update = async (
  personalExperience: Partial<PersonalExperience>,
  profileId: string,
  token: string,
) => {
  await put(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperience.id}`,
    personalExperience,
    token,
  )
}

const deleteOne = async (personalExperienceId: string, profileId: string, token: string) => {
  await destroy(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/personal_experiences/${personalExperienceId}`,
    token,
  )
}

export const FrontendPersonalExperiencesService = {
  update,
  create,
  deleteOne,
}
