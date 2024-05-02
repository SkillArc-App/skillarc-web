import { PartialRequired } from '@/common/types/partial-required'
import { destroy, post, put } from '../http-common'

export type OtherExperience = {
  id: string
  profileId: string
  organizationId: string | null
  organizationName: string | null
  startDate: string | null
  isCurrent: boolean | null
  endDate: string | null
  description: string | null
  position: string | null
}

const create = async (
  otherExperience: PartialRequired<OtherExperience, 'profileId'>,
  token: string,
) => {
  await post(`/profiles/${otherExperience.profileId}/other_experiences`, otherExperience, token)
}

const update = async (
  otherExperience: PartialRequired<OtherExperience, 'profileId'>,
  token: string,
) => {
  await put(
    `/profiles/${otherExperience.profileId}/other_experiences/${otherExperience.id}`,
    otherExperience,
    token,
  )
}

const deleteOne = async (
  { id, profileId }: PartialRequired<OtherExperience, 'profileId' | 'id'>,
  token: string,
) => {
  await destroy(`/profiles/${profileId}/other_experiences/${id}`, token)
}

export const FrontendOtherExperiencesService = {
  update,
  create,
  deleteOne,
}
