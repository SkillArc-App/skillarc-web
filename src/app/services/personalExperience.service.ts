import { PartialRequired } from '@/app/common/types/partial-required'
import { destroy, post, put } from '../http-common'

export type PersonalExperience = {
  id: string
  profileId: string
  activity: string | null
  startDate: string | null
  endDate: string | null
  description: string | null
}

const create = async (
  personalExperience: PartialRequired<PersonalExperience, 'profileId'>,
  token: string,
) => {
  await post(
    `/profiles/${personalExperience.profileId}/personal_experiences`,
    personalExperience,
    token,
  )
}

const update = async (
  personalExperience: PartialRequired<PersonalExperience, 'profileId'>,
  token: string,
) => {
  await put(
    `/profiles/${personalExperience.profileId}/personal_experiences/${personalExperience.id}`,
    personalExperience,
    token,
  )
}

const deleteOne = async (
  { id, profileId }: PartialRequired<PersonalExperience, 'profileId' | 'id'>,
  token: string,
) => {
  await destroy(`/profiles/${profileId}/personal_experiences/${id}`, token)
}

export const FrontendPersonalExperiencesService = {
  update,
  create,
  deleteOne,
}
