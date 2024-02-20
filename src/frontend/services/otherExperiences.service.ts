import { destroy, post, put } from '../http-common'

export type OtherExperience = {
  id: string
  organizationId: string | null
  organizationName: string | null
  startDate: string | null
  isCurrent: boolean | null
  endDate: string | null
  description: string | null
  position: string | null
}

const create = async (
  otherExperience: Partial<OtherExperience>,
  profileId: string,
  token: string,
) => {
  const res = await post(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/other_experiences`,
    otherExperience,
    token,
  )
  return res.data
}

const update = async (
  otherExperience: Partial<OtherExperience>,
  profileId: string,
  token: string,
) => {
  const res = await put(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/other_experiences/${otherExperience.id}`,
    otherExperience,
    token,
  )

  return res.data
}

const deleteOne = async (otherExperienceId: string, profileId: string, token: string) => {
  const res = await destroy(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/other_experiences/${otherExperienceId}`,
    token,
  )
  return res.data
}

export const FrontendOtherExperiencesService = {
  update,
  create,
  deleteOne,
}
