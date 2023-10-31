import { EducationExperience } from '@prisma/client'
import { http } from '../http-common'
import axios from 'axios'

const create = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences`,
      educationExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const update = async (
  educationExperience: Partial<EducationExperience>,
  profileId: string,
  token: string,
) => {
  const res = await axios
    .create({ withCredentials: false })
    .put(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperience.id}`,
      educationExperience,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

const deleteOne = async (educationExperienceId: string, profileId: string, token: string) => {
  const res = await axios
    .create({ withCredentials: false })
    .delete(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${profileId}/education_experiences/${educationExperienceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
  return res.data
}

export const FrontendEducationExperiencesService = {
  update,
  create,
  deleteOne,
}
