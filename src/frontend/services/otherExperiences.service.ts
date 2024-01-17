import { destroy, post, put } from '../http-common'

export type OtherExperience = {
  id: string
  organization_id: string | null
  organization_name: string | null
  profile_id: string
  start_date: string | null
  is_current: boolean | null
  end_date: string | null
  description: string | null
  position: string | null
  created_at: Date
  updated_at: Date
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
  // const res = await http.delete(`/api/profiles/${profileId}/otherExperiences/${otherExperienceId}`)
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
