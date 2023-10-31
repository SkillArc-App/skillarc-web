import { OtherExperience } from '@prisma/client'
import { http } from '../http-common'

const create = async (otherExperience: Partial<OtherExperience>, profileId: string) => {
  const res = await http.post(`/api/profiles/${profileId}/otherExperiences`, otherExperience)
  return res.data
}

const update = async (otherExperience: OtherExperience, profileId: string) => {
  const res = await http.put(
    `/api/profiles/${profileId}/otherExperiences/${otherExperience.id}`,
    otherExperience,
  )
  return res.data
}

const deleteOne = async (otherExperienceId: string, profileId: string) => {
  const res = await http.delete(`/api/profiles/${profileId}/otherExperiences/${otherExperienceId}`)
  return res.data
}

export const FrontendOtherExperiencesService = {
  update,
  create,
  deleteOne,
}
